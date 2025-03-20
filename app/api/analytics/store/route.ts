import { Interaction } from '@/app/models/interaction';
import dbConnect from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const data = await request.json();
    const interaction = {
      id: uuidv4(),
      timestamp: new Date(),
      ...data,
    };

    const newInteraction = await Interaction.create(interaction);

    return NextResponse.json({
      success: true,
      id: newInteraction.id,
    });
  } catch (error) {
    console.error('Failed to store interaction:', error);
    return NextResponse.json(
      { error: 'Failed to store interaction' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();

    const interactions = await Interaction.find()
      .sort({ timestamp: -1 }) // Sort by newest first
      .limit(1000); // Limit to last 1000 interactions for performance

    return NextResponse.json({ interactions });
  } catch (error) {
    console.error('Failed to fetch interactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interactions' },
      { status: 500 }
    );
  }
}
