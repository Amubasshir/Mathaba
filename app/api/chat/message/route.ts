import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { threadId, content, assistantId } = await request.json();

    if (!threadId || !content || !assistantId) {
      return NextResponse.json(
        { error: 'ThreadId, content, and assistantId are required' },
        { status: 400 }
      );
    }

    // Add the user's message to the thread
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content,
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    // Wait for the run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    while (
      runStatus.status === 'in_progress' ||
      runStatus.status === 'queued'
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    }

    if (runStatus.status !== 'completed') {
      throw new Error(`Run failed with status: ${runStatus.status}`);
    }

    // Get the assistant's response
    const messages = await openai.beta.threads.messages.list(threadId);
    const lastMessage = messages.data[0];

    if (!lastMessage || lastMessage.role !== 'assistant') {
      throw new Error('No assistant response found');
    }

    const messageContent = lastMessage.content[0];
    if (messageContent.type !== 'text') {
      throw new Error('Unexpected message content type');
    }

    return NextResponse.json({
      message: messageContent.text.value,
    });
  } catch (error) {
    console.error('Message handling error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
