import Feedback from "@/app/models/feedback";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const {
      rating,
      message,
      language,
      ageRange,
      gender,
      nationality,
      location,
      target,
    } = body;

    // Validate required fields
    if (!rating || !language || !ageRange || !gender || !nationality) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Validate field values
    if (typeof rating !== "number" || rating < 0 || rating > 10) {
      return NextResponse.json(
        { success: false, error: "Invalid rating value" },
        { status: 400 }
      );
    }

    const validAgeRanges = [
      "13-17",
      "18-24",
      "25-34",
      "35-44",
      "45-54",
      "55-64",
      "65+",
    ];
    if (!validAgeRanges.includes(ageRange)) {
      return NextResponse.json(
        { success: false, error: "Invalid age range" },
        { status: 400 }
      );
    }

    const validGenders = ["male", "female"];
    if (!validGenders.includes(body.gender)) {
      return NextResponse.json(
        { success: false, error: "Invalid gender value" },
        { status: 400 }
      );
    }

    // Create feedback with validated data
    const feedbackData = {
      rating: body.rating,
      message: body.message || "",
      language: body.language,
      ageRange: body.ageRange,
      gender: body.gender,
      location: body.location || null,
      nationality: body.nationality,
      target: target,
    };

    try {
      const feedback = await Feedback.create(feedbackData);

      // Verify the saved data
      const savedFeedback = await Feedback.findById(feedback._id);

      return NextResponse.json({
        success: true,
        data: feedback,
        message: "Feedback submitted successfully",
      });
    } catch (modelError: any) {
      console.error("Mongoose validation error:", modelError);
      if (modelError.name === "ValidationError") {
        const validationErrors = Object.values(modelError.errors).map(
          (err: any) => err.message
        );
        return NextResponse.json(
          {
            success: false,
            error: "Validation failed",
            details: validationErrors,
          },
          { status: 400 }
        );
      }
      throw modelError; // Re-throw if it's not a validation error
    }
  } catch (error) {
    console.error("Error in POST feedback:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const target = searchParams.get("target") as string;
    const skip = (page - 1) * limit;

    const total = await Feedback.countDocuments({ target });
    const query = target ? { target } : {};

    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    // const feedbacks = await Feedback.find()
    //   .sort({ createdAt: -1 })
    //   .skip(skip)
    //   .limit(limit)
    //   .lean(); // Use lean() for better performance

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
    console.error("Error in GET feedback:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch feedbacks" },
      { status: 500 }
    );
  }
}
