import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { input } = await request.json();

    if (!input) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 });
    }

    const moderation = await openai.moderations.create({ input });

    return NextResponse.json({
      flagged: moderation.results[0].flagged,
      categories: moderation.results[0].categories,
    });
  } catch (error) {
    console.error('Moderation error:', error);
    return NextResponse.json(
      { error: 'Failed to moderate content' },
      { status: 500 }
    );
  }
}
