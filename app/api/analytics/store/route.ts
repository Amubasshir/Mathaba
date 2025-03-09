import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// In a real application, this would be a database
let interactions: any[] = [];

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const interaction = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      ...data,
    };

    interactions.push(interaction);

    return NextResponse.json({ success: true, id: interaction.id });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to store interaction' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({ interactions });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch interactions' },
      { status: 500 }
    );
  }
}
