import Suggestion from "@/app/models/suggestions";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const language = searchParams.get("language") || "en";

    if (!query) {
      return NextResponse.json({ suggestions: [] });
    }

    await dbConnect();

    // Create a dynamic query object based on language
    const searchField = `questions_${language}`;
    const queryObject = {
      [searchField]: {
        $regex: query,
        $options: "i", // case-insensitive
      },
    };

    // Select only necessary fields for better performance
    const suggestions = await Suggestion.find(queryObject)
      .select(`questions_${language} answers_${language} URL Ref`)
      .limit(10) // Limit results for better performance
      .lean() // Convert to plain JS objects for faster serialization
      .exec();

    return NextResponse.json(
      {
        success: true,
        suggestions,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        },
      }
    );
  } catch (error) {
    console.error("Suggestions API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
