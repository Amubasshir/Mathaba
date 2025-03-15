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
      content: 'start',
    });

    // Create an initial run with assistant ID
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: 'asst_6JH9SIKjfPQrfApGdC0am63k',
    });

    // Wait for the run to complete
    let completedRun;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      completedRun = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      if (completedRun.status === 'completed') {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      attempts++;
    }

    // Get the assistant's greeting message
    const messages = await openai.beta.threads.messages.list(thread.id);
    const greeting =
      messages.data[0]?.content[0]?.type === 'text'
        ? preserveFormatting(messages.data[0].content[0].text.value)
        : '';

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
  } catch (error) {
    console.error('Thread creation error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create thread' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  }
}
