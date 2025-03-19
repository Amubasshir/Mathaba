import OpenAI from 'openai';

// Configure Edge Runtime
export const runtime = 'edge';
export const maxDuration = 25; // 25 seconds max duration for edge runtime

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 2,
  timeout: 20000, // 20 seconds timeout
});

// Helper functions for stream handling
function createStream(data: string) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(data));
      controller.close();
    },
  });
  return stream;
}

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

// Step 1: Content Moderation
async function moderateContent(content: string): Promise<boolean> {
  try {
    const moderation = await openai.moderations.create({ input: content });
    return moderation.results[0].flagged;
  } catch (error) {
    console.error('Moderation error:', error);
    throw new Error('Content moderation failed');
  }
}

// Define trusted domains for Hajj and Umrah related information
const trustedDomains = [
  // Government and Official Sites
  'my.gov.sa',
  'alharamain.gov.sa',
  'haj.gov.sa',
  'nusuk.sa',
  'moh.gov.sa',
  'kaia.sa',
  'makkahtransit.sa',
  'makkahcci.org.sa',
  'rcmc.gov.sa',
  'https://my.gov.sa/en/content/hajj-umrah#section-1',
  'https://alharamain.gov.sa/public/?module=eservices',
  'https://alharamain.gov.sa/public/?module=module_894348&main_subject=main_130159',
  'https://my.gov.sa/ar/content/hajj-umrah#section-6',
  'https://www.makkahtransit.sa/mtbp/ar-sa/journey-planner/content/favorites',
  'https://learn.haj.gov.sa/landing/index-en.html',
  'https://rcmc.gov.sa/discover-makkah',
  'https://ta.sdaia.gov.sa/#services',

  // Religious Authority Sites
  'alifta.gov.sa',
  'azhar.eg',
  'binbaz.org.sa',
  'islamqa.info',
].join(',');

// Step 2: Topic Validation and Input Processing
async function processWithChatCompletion(
  content: string
): Promise<{ isValid: boolean; processedInput?: string }> {
  // Bypass all validation and always return valid
  return {
    isValid: true,
    processedInput: content,
  };

  /* Original code commented out
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a specialized validator...`
        },
        {
          role: 'user',
          content: content,
        },
      ],
      temperature: 0,
    });

    const result = completion.choices[0]?.message?.content || '';
    if (result.startsWith('VALID:')) {
      return {
        isValid: true,
        processedInput: result.substring(6).trim(),
      };
    }
    return { isValid: false };
  } catch (error) {
    console.error('Chat completion error:', error);
    throw new Error('Input processing failed');
  }
  */
}

// Function to preserve formatting
function preserveFormatting(text: string): string {
  // Replace single newlines with double newlines to ensure proper spacing
  return text
    .replace(/\n/g, '\n\n') // Double all newlines
    .replace(/\n\n\n\n/g, '\n\n') // But prevent more than double newlines
    .replace(/- /g, '\n- ') // Ensure list items are on new lines
    .replace(/\n\n- /g, '\n- ') // But prevent double newlines before list items
    .trim();
}

// Function to get restriction message based on language
function getRestrictionMessage(language: string): string {
  return language === 'ar'
    ? 'عذراً، لا أستطيع الإجابة إلا على الأسئلة المتعلقة بصحة الحجاج، والحج، والعمرة، ومكة، والمدينة، والمسجد الحرام، والمسجد النبوي.'
    : "I'm sorry, I can only answer questions related to pilgrims' health, Hajj, Umrah, Makkah, Madinah, Masjid al-Haram, and Masjid al-Nabawi.";
}

export async function POST(req: Request) {
  try {
    const {
      threadId,
      content,
      assistantId,
      toolCallId,
      language = 'en',
    } = await req.json();

    // Handle tool call responses
    if (toolCallId) {
      try {
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

        const completedRun = await waitForRunCompletion(threadId, run.id);
        const messages = await openai.beta.threads.messages.list(threadId);
        const lastMessageContent = messages.data[0].content[0];

        return new Response(
          createStream(
            JSON.stringify({
              message:
                lastMessageContent.type === 'text'
                  ? preserveFormatting(lastMessageContent.text.value)
                  : '',
            })
          ),
          {
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-transform',
            },
          }
        );
      } catch (error) {
        console.error('Tool call submission error:', error);
        throw error;
      }
    }

    // Step 1: Content Moderation
    const isContentFlagged = await moderateContent(content);
    if (isContentFlagged) {
      return new Response(
        createStream(
          JSON.stringify({
            message:
              'I apologize, but I cannot process this request as it contains inappropriate content.',
          })
        ),
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-transform',
          },
        }
      );
    }

    // Step 2: Topic Validation and Input Processing
    const { isValid, processedInput } = await processWithChatCompletion(
      content
    );
    if (!isValid) {
      return new Response(
        createStream(
          JSON.stringify({
            message: getRestrictionMessage(language),
          })
        ),
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-transform',
          },
        }
      );
    }

    // Ensure no active runs before proceeding
    await ensureThreadReady(threadId);

    // Step 3: Process with Assistant API
    try {
      await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: processedInput || content,
      });

      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
        tools: [
          {
            type: 'function',
            function: {
              name: 'search_web',
              description:
                'Search the web for real-time information about Hajj, Umrah, and pilgrim health matters',
              parameters: {
                type: 'object',
                properties: {
                  query: {
                    type: 'string',
                    description:
                      'The search query related to Hajj, Umrah, or pilgrim health',
                  },
                },
                required: ['query'],
              },
            },
          },
        ],
      });

      const completedRun = await waitForRunCompletion(threadId, run.id);

      // Handle tool calls if needed
      if (completedRun.status === 'requires_action') {
        const toolCalls =
          completedRun.required_action?.submit_tool_outputs.tool_calls;
        if (toolCalls && toolCalls[0].function.name === 'search_web') {
          const searchQuery = JSON.parse(toolCalls[0].function.arguments).query;

          // Perform web search with timeout and specific focus
          const searchResponse = await fetch(
            `https://www.googleapis.com/customsearch/v1?key=${
              process.env.GOOGLE_SEARCH_API_KEY
            }&cx=${process.env.GOOGLE_SEARCH_CX}&q=${encodeURIComponent(
              searchQuery
            )}&siteSearch=${trustedDomains}&siteSearchFilter=i&num=10`,
            {
              signal: AbortSignal.timeout(8000),
            }
          );

          if (!searchResponse.ok) {
            throw new Error(
              `Search request failed: ${searchResponse.statusText}`
            );
          }

          const searchData = await searchResponse.json();

          // Submit search results
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
          await waitForRunCompletion(threadId, submitResponse.id);
        }
      }

      // Get the final message
      const messages = await openai.beta.threads.messages.list(threadId);
      const lastMessageContent = messages.data[0].content[0];

      return new Response(
        createStream(
          JSON.stringify({
            message:
              lastMessageContent.type === 'text'
                ? preserveFormatting(lastMessageContent.text.value)
                : '',
          })
        ),
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-transform',
          },
        }
      );
    } catch (error) {
      console.error('Assistant processing error:', error);
      throw error;
    }
  } catch (error: any) {
    console.error('Error in chat message route:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to process message',
        details: error instanceof Error ? error.stack : undefined,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-transform',
        },
      }
    );
  }
}

async function waitForRunCompletion(threadId: string, runId: string) {
  const startTime = Date.now();
  const timeout = 20000; // 20 second timeout

  while (true) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Run completion timed out');
    }

    const run = await openai.beta.threads.runs.retrieve(threadId, runId);

    if (
      run.status === 'completed' ||
      run.status === 'requires_action' ||
      run.status === 'failed'
    ) {
      if (run.status === 'failed') {
        throw new Error(
          `Run failed: ${run.last_error?.message || 'Unknown error'}`
        );
      }
      return run;
    }

    await wait(1000); // Wait 1 second before checking again
  }
}
