import Feedback from '@/app/models/feedback';
import dbConnect from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // Validate all required fields
    const requiredFields = ['rating', 'ageRange', 'gender', 'language'];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate field values
    if (
      typeof body.rating !== 'number' ||
      body.rating < 0 ||
      body.rating > 10
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid rating value' },
        { status: 400 }
      );
    }

    const validAgeRanges = [
      '13-17',
      '18-24',
      '25-34',
      '35-44',
      '45-54',
      '55-64',
      '65+',
    ];
    if (!validAgeRanges.includes(body.ageRange)) {
      return NextResponse.json(
        { success: false, error: 'Invalid age range' },
        { status: 400 }
      );
    }

    const validGenders = ['male', 'female'];
    if (!validGenders.includes(body.gender)) {
      return NextResponse.json(
        { success: false, error: 'Invalid gender value' },
        { status: 400 }
      );
    }

    // Create feedback with validated data
    const feedbackData = {
      rating: body.rating,
      message: body.message || '',
      language: body.language,
      ageRange: body.ageRange,
      gender: body.gender,
      location: body.location || null,
    };

    try {
      const feedback = await Feedback.create(feedbackData);

      // Verify the saved data
      const savedFeedback = await Feedback.findById(feedback._id);

      return NextResponse.json({
        success: true,
        data: feedback,
        message: 'Feedback submitted successfully',
      });
    } catch (modelError: any) {
      console.error('Mongoose validation error:', modelError);
      if (modelError.name === 'ValidationError') {
        const validationErrors = Object.values(modelError.errors).map(
          (err: any) => err.message
        );
        return NextResponse.json(
          {
            success: false,
            error: 'Validation failed',
            details: validationErrors,
          },
          { status: 400 }
        );
      }
      throw modelError; // Re-throw if it's not a validation error
    }
  } catch (error) {
    console.error('Error in POST feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const total = await Feedback.countDocuments();
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance

    return NextResponse.json({
      success: true,
      data: feedbacks,
      paginate: {
        totalPage: Math.ceil(total / limit),
        currentPage: page,
        total,
      },
    });
  } catch (error) {
    console.error('Error in GET feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch feedbacks' },
      { status: 500 }
    );
  }
}
