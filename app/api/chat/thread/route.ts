import OpenAI from 'openai';

// Configure Edge Runtime
export const runtime = 'edge';
export const maxDuration = 10;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 2,
  timeout: 8000,
});

export async function POST() {
  try {
    // Create a new thread
    const thread = await openai.beta.threads.create();

    return new Response(JSON.stringify({ threadId: thread.id }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
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
