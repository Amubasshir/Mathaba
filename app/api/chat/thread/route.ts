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

export async function POST(req: Request) {
  try {
    // Get language from request
    const { searchParams } = new URL(req.url);
    const language = searchParams.get('language') || 'en';

    // Create a new thread
    const thread = await openai.beta.threads.create();

    // Set greeting based on language
    const greeting =
      language === 'ar'
        ? 'أهلاً بك أيها الحاج. أنا مساعدك في الحج والعمرة، هنا لأقدم لك التوجيه والدعم في رحلتك. كيف يمكنني مساعدتك اليوم؟'
        : "Greetings, pilgrim. I am your Hajj and Umrah assistant, here to guide you on your spiritual journey. Whether you need health advice or information about your pilgrimage, I'm here to help.";

    // Create an initial message
    await openai.beta.threads.messages.create(thread.id, {
      role: 'assistant',
      content: greeting,
    });

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
