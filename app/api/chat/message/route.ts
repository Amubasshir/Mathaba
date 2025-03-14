import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 3,
  timeout: 60000, // 60 seconds timeout
});

// Function to wait for a short period
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to check if a thread has any active runs
async function getActiveRun(threadId: string) {
  const runs = await openai.beta.threads.runs.list(threadId);
  return runs.data.find(
    (run) =>
      run.status === 'in_progress' ||
      run.status === 'queued' ||
      run.status === 'requires_action'
  );
}

// Function to safely cancel a run and wait for cancellation
async function safelyCancelRun(threadId: string, runId: string) {
  try {
    await openai.beta.threads.runs.cancel(threadId, runId);

    // Wait and verify the run is cancelled
    let maxAttempts = 5;
    while (maxAttempts > 0) {
      const run = await openai.beta.threads.runs.retrieve(threadId, runId);
      if (run.status === 'cancelled') {
        return true;
      }
      await wait(1000);
      maxAttempts--;
    }
    return false;
  } catch (error) {
    console.error(`Error cancelling run ${runId}:`, error);
    return false;
  }
}

// Function to ensure thread is ready for new messages
async function ensureThreadReady(threadId: string) {
  let attempts = 5;
  while (attempts > 0) {
    const activeRun = await getActiveRun(threadId);
    if (!activeRun) {
      return true;
    }

    if (activeRun) {
      await safelyCancelRun(threadId, activeRun.id);
    }

    await wait(1000);
    attempts--;
  }
  throw new Error(
    'Could not prepare thread for new message after multiple attempts'
  );
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
  try {
    const { threadId, content, assistantId, toolCallId } = await req.json();

    // Handle tool call responses
    if (toolCallId) {
      try {
        // Ensure no other runs are active before submitting tool outputs
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

    // Create the message only after ensuring thread is ready
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

    // Create a new run
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

    // Wait for the run to complete with increased timeout
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
          ); // 10s timeout for search

          try {
            const searchResponse = await fetch(
              `https://www.googleapis.com/customsearch/v1?key=${
                process.env.GOOGLE_SEARCH_API_KEY
              }&cx=${process.env.GOOGLE_SEARCH_CX}&q=${encodeURIComponent(
                searchQuery
              )}`,
              { signal: searchController.signal }
            );

            clearTimeout(searchTimeout);

            if (!searchResponse.ok) {
              throw new Error(
                `Search request failed: ${searchResponse.statusText}`
              );
            }

            const searchData = await searchResponse.json();

            // Submit the search results back to the assistant
            const submitResponse =
              await openai.beta.threads.runs.submitToolOutputs(
                threadId,
                completedRun.id,
                {
                  tool_outputs: [
                    {
                      tool_call_id: toolCalls[0].id,
                      output: JSON.stringify(searchData),
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
    return NextResponse.json({
      message:
        lastMessageContent.type === 'text' ? lastMessageContent.text.value : '',
    });
  } catch (error: any) {
    console.error('Error in chat message route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process message' },
      { status: 500 }
    );
  }
}

async function waitForRunCompletion(threadId: string, runId: string) {
  let run;
  let attempts = 0;
  const maxAttempts = 60; // Allow up to 60 seconds

  try {
    run = await openai.beta.threads.runs.retrieve(threadId, runId);

    while (
      (run.status === 'in_progress' || run.status === 'queued') &&
      attempts < maxAttempts
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      run = await openai.beta.threads.runs.retrieve(threadId, runId);
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error('Request timed out after 60 seconds');
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
