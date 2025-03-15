import OpenAI from 'openai';

// Configure Edge Runtime
export const runtime = 'edge';
export const maxDuration = 10;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 2,
  timeout: 8000,
});

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

export async function POST() {
  try {
    // Create a new thread
    const thread = await openai.beta.threads.create();

    // Create an initial message to trigger the assistant's greeting
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content:
        'Please provide a greeting and introduce yourself as a Hajj and Umrah assistant.',
    });

    // Create an initial run with assistant ID and web search tool
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: 'asst_6JH9SIKjfPQrfApGdC0am63k',
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

    // Wait for the run to complete with improved error handling
    let completedRun;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      completedRun = await openai.beta.threads.runs.retrieve(thread.id, run.id);

      if (completedRun.status === 'completed') {
        break;
      } else if (completedRun.status === 'failed') {
        throw new Error(
          `Run failed: ${completedRun.last_error?.message || 'Unknown error'}`
        );
      } else if (completedRun.status === 'requires_action') {
        // Handle any required tool calls
        const toolCalls =
          completedRun.required_action?.submit_tool_outputs.tool_calls;
        if (toolCalls && toolCalls[0].function.name === 'search_web') {
          const searchQuery = JSON.parse(toolCalls[0].function.arguments).query;

          // Perform web search
          const searchResponse = await fetch(
            `https://www.googleapis.com/customsearch/v1?key=${
              process.env.GOOGLE_SEARCH_API_KEY
            }&cx=${process.env.GOOGLE_SEARCH_CX}&q=${encodeURIComponent(
              searchQuery
            )}`,
            { signal: AbortSignal.timeout(5000) }
          );

          if (!searchResponse.ok) {
            throw new Error(
              `Search request failed: ${searchResponse.statusText}`
            );
          }

          const searchData = await searchResponse.json();

          // Submit search results
          completedRun = await openai.beta.threads.runs.submitToolOutputs(
            thread.id,
            run.id,
            {
              tool_outputs: [
                {
                  tool_call_id: toolCalls[0].id,
                  output: JSON.stringify(searchData),
                },
              ],
            }
          );
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error('Greeting generation timed out');
    }

    // Get the assistant's greeting message
    const messages = await openai.beta.threads.messages.list(thread.id);
    const greeting =
      messages.data[0]?.content[0]?.type === 'text'
        ? preserveFormatting(messages.data[0].content[0].text.value)
        : 'Welcome! I am your Hajj and Umrah assistant. How can I help you today?';

    return new Response(
      JSON.stringify({
        threadId: thread.id,
        greeting: greeting,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-transform',
        },
      }
    );
  } catch (error: any) {
    console.error('Thread creation error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to create thread',
        details: error.message,
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
