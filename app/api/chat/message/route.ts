import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Add Edge Runtime
export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 2,
  timeout: 30000, // 30 seconds timeout
});

// Function to wait for a short period
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to check if a thread has any active runs with timeout
async function getActiveRun(threadId: string) {
  try {
    const runs = await openai.beta.threads.runs.list(threadId);
    return runs.data.find(
      (run) =>
        run.status === 'in_progress' ||
        run.status === 'queued' ||
        run.status === 'requires_action'
    );
  } catch (error) {
    console.error('Error checking active runs:', error);
    return null;
  }
}

// Function to safely cancel a run with timeout
async function safelyCancelRun(threadId: string, runId: string) {
  try {
    await openai.beta.threads.runs.cancel(threadId, runId);

    // Wait and verify the run is cancelled
    let maxAttempts = 3;
    while (maxAttempts > 0) {
      const run = await openai.beta.threads.runs.retrieve(threadId, runId);
      if (run.status === 'cancelled') {
        return true;
      }
      await wait(500); // Reduced wait time
      maxAttempts--;
    }
    return false;
  } catch (error) {
    console.error(`Error cancelling run ${runId}:`, error);
    return false;
  }
}

// Function to ensure thread is ready with timeout
async function ensureThreadReady(threadId: string) {
  let attempts = 3;
  while (attempts > 0) {
    const activeRun = await getActiveRun(threadId);
    if (!activeRun) {
      return true;
    }

    if (activeRun) {
      await safelyCancelRun(threadId, activeRun.id);
    }

    await wait(500); // Reduced wait time
    attempts--;
  }
  throw new Error('Could not prepare thread for new message');
}

// Function to check and handle active runs
async function handleActiveRuns(threadId: string) {
  try {
    // List all runs for the thread
    const runs = await openai.beta.threads.runs.list(threadId);

    // Find any active runs (in_progress or queued)
    const activeRuns = runs.data.filter(
      (run) => run.status === 'in_progress' || run.status === 'queued'
    );

    // If there are active runs, cancel them
    for (const run of activeRuns) {
      try {
        await openai.beta.threads.runs.cancel(threadId, run.id);
        console.log(`Cancelled active run: ${run.id}`);
      } catch (error) {
        console.error(`Failed to cancel run ${run.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error handling active runs:', error);
    throw error;
  }
}

export async function POST(req: Request) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout

  try {
    const { threadId, content, assistantId, toolCallId } = await req.json();

    // First, check moderation for non-tool-call messages
    if (!toolCallId) {
      console.log('Checking content moderation...');
      const moderationResponse = await openai.moderations.create({
        input: content,
      });

      const results = moderationResponse.results[0];
      if (results.flagged) {
        console.log('Content flagged by moderation:', results.categories);
        return NextResponse.json(
          { error: 'This message contains inappropriate content' },
          { status: 400 }
        );
      }
      console.log('Content passed moderation check');
    }

    // Handle tool call responses
    if (toolCallId) {
      try {
        await ensureThreadReady(threadId);

        const run = await openai.beta.threads.runs.submitToolOutputs(
          threadId,
          toolCallId,
          {
            tool_outputs: [
              {
                tool_call_id: toolCallId,
                output: content,
              },
            ],
          }
        );

        let completedRun = await waitForRunCompletion(threadId, run.id);
        const messages = await openai.beta.threads.messages.list(threadId);
        const lastMessageContent = messages.data[0].content[0];

        clearTimeout(timeoutId);
        return NextResponse.json({
          message:
            lastMessageContent.type === 'text'
              ? lastMessageContent.text.value
              : '',
        });
      } catch (error) {
        console.error('Tool call submission error:', error);
        throw error;
      }
    }

    // For new messages, ensure thread is ready
    await ensureThreadReady(threadId);

    // Create the message
    try {
      await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: content,
      });
    } catch (error) {
      console.error('Message creation error:', error);
      throw error;
    }

    // Small wait to ensure message is processed
    await wait(500);

    // Create a new run with reduced timeout
    let run;
    try {
      run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
        tools: [
          {
            type: 'function',
            function: {
              name: 'search_web',
              description: 'Search the web for real-time information',
              parameters: {
                type: 'object',
                properties: {
                  query: {
                    type: 'string',
                    description: 'The search query',
                  },
                },
                required: ['query'],
              },
            },
          },
        ],
      });
    } catch (error) {
      console.error('Run creation error:', error);
      throw error;
    }

    // Wait for run completion with timeout
    let completedRun = await waitForRunCompletion(threadId, run.id);

    // If there are tool calls, handle them
    if (completedRun.status === 'requires_action') {
      const toolCalls =
        completedRun.required_action?.submit_tool_outputs.tool_calls;
      if (toolCalls && toolCalls[0].function.name === 'search_web') {
        try {
          // Extract the search query
          const searchQuery = JSON.parse(toolCalls[0].function.arguments).query;

          // Perform the web search with timeout
          const searchController = new AbortController();
          const searchTimeout = setTimeout(
            () => searchController.abort(),
            10000
          );

          try {
            // Enhance search query for weather-specific results
            const enhancedQuery = searchQuery.includes('weather')
              ? `${searchQuery} site:weather.com OR site:accuweather.com OR site:weatherapi.com current conditions`
              : searchQuery;

            const searchResponse = await fetch(
              `https://www.googleapis.com/customsearch/v1?key=${
                process.env.GOOGLE_SEARCH_API_KEY
              }&cx=${process.env.GOOGLE_SEARCH_CX}&q=${encodeURIComponent(
                enhancedQuery
              )}&dateRestrict=d1`, // Restrict to last 24 hours
              { signal: searchController.signal }
            );

            clearTimeout(searchTimeout);

            if (!searchResponse.ok) {
              throw new Error(
                `Search request failed: ${searchResponse.statusText}`
              );
            }

            const searchData = await searchResponse.json();

            // Define types for search results
            interface SearchItem {
              link: string;
              snippet: string;
              pagemap?: {
                metatags?: Array<{
                  'og:description'?: string;
                }>;
              };
            }

            // Process search results to ensure valid URLs and recent content
            const processedData = {
              ...searchData,
              items: searchData.items?.map((item: SearchItem) => ({
                ...item,
                // Clean up URLs by removing tracking parameters
                link: item.link.split('?')[0],
                // Ensure snippet is relevant and recent
                snippet:
                  item.snippet +
                  (item.pagemap?.metatags?.[0]?.['og:description'] || ''),
              })),
            };

            // Submit the processed search results back to the assistant
            const submitResponse =
              await openai.beta.threads.runs.submitToolOutputs(
                threadId,
                completedRun.id,
                {
                  tool_outputs: [
                    {
                      tool_call_id: toolCalls[0].id,
                      output: JSON.stringify(processedData),
                    },
                  ],
                }
              );

            // Wait for final response
            const finalRun = await waitForRunCompletion(
              threadId,
              submitResponse.id
            );
            const messages = await openai.beta.threads.messages.list(threadId);
            const lastMessageContent = messages.data[0].content[0];

            return NextResponse.json({
              message:
                lastMessageContent.type === 'text'
                  ? lastMessageContent.text.value
                  : '',
            });
          } finally {
            clearTimeout(searchTimeout);
          }
        } catch (error) {
          console.error('Search processing error:', error);
          throw error;
        }
      }
    }

    // Get the latest message
    const messages = await openai.beta.threads.messages.list(threadId);
    const lastMessageContent = messages.data[0].content[0];
    clearTimeout(timeoutId);
    return NextResponse.json({
      message:
        lastMessageContent.type === 'text' ? lastMessageContent.text.value : '',
    });
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('Error in chat message route:', error);

    // Check if it's an abort error
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout - please try again' },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to process message' },
      { status: 500 }
    );
  }
}

async function waitForRunCompletion(threadId: string, runId: string) {
  let run;
  let attempts = 0;
  const maxAttempts = 30; // Reduced max attempts (30 seconds)

  try {
    run = await openai.beta.threads.runs.retrieve(threadId, runId);

    while (
      (run.status === 'in_progress' || run.status === 'queued') &&
      attempts < maxAttempts
    ) {
      await wait(1000);
      run = await openai.beta.threads.runs.retrieve(threadId, runId);
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error('Request timed out after 30 seconds');
    }

    if (run.status === 'failed') {
      throw new Error(
        `Run failed: ${run.last_error?.message || 'Unknown error'}`
      );
    }

    return run;
  } catch (error: any) {
    console.error('Run completion error:', error);
    throw new Error(`Run completion failed: ${error.message}`);
  }
}
