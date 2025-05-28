// import Suggestion from "@/app/models/suggestions";
// import dbConnect from "@/lib/dbConnect";
// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const query = searchParams.get("query") || "";
//     const language = searchParams.get("language") || "en";

//     if (!query) {
//       return NextResponse.json({ suggestions: [] });
//     }

//     await dbConnect();

//     // Create a dynamic query object based on language
//     const searchField = `questions_${language}`;
//     const queryObject = {
//       [searchField]: {
//         $regex: query,
//         $options: "i", // case-insensitive
//       },
//     };

//     // Select only necessary fields for better performance
//     const suggestions = await Suggestion.find(queryObject)
//       .select(`questions_${language} answers_${language} URL Ref`)
//       .limit(10) // Limit results for better performance
//       .lean() // Convert to plain JS objects for faster serialization
//       .exec();

//     return NextResponse.json(
//       {
//         success: true,
//         suggestions,
//       },
//       {
//         headers: {
//           "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
//         },
//       }
//     );
//   } catch (error) {
//     console.error("Suggestions API Error:", error);
//     return NextResponse.json(
//       { success: false, error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }



import Suggestion from "@/app/models/suggestions";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

// Keep connection alive
let cachedConnection = null;

async function getDbConnection() {
  if (cachedConnection) {
    return cachedConnection;
  }
  
  cachedConnection = await dbConnect();
  return cachedConnection;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim();
    const language = searchParams.get("language") || "en";

    // Quick validation
    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    // Limit query length
    if (query.length > 50) {
      return NextResponse.json({ suggestions: [] });
    }

    await getDbConnection();

    const searchField = `questions_${language}`;
    
    // Escape regex special characters for safety
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Optimized aggregation pipeline
    const suggestions = await Suggestion.aggregate([
      {
        $match: {
          [searchField]: {
            $regex: escapedQuery,
            $options: "i"
          }
        }
      },
      {
        $project: {
          _id: 0, // Exclude _id to reduce data size
          [`questions_${language}`]: 1,
          [`answers_${language}`]: 1,
          URL: 1,
          Ref: 1
        }
      },
      {
        $limit: 10
      }
    ])
    .allowDiskUse(false) // Force memory usage for speed
    .option({ maxTimeMS: 500 }) // Prevent slow queries
    .exec();

    return NextResponse.json(
      {
        success: true,
        suggestions,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
    
  } catch (error) {
    console.error("API Error:", error.message);
    
    // Return empty array instead of error for better UX
    return NextResponse.json({
      success: true,
      suggestions: []
    });
  }
}