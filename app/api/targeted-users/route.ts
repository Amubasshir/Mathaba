import { Interaction } from "@/app/models/interaction";
import TargetedUser from "@/app/models/targetedUser";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

// POST endpoint to create or check targeted user
// export async function POST(request: Request) {
//   try {
//     await dbConnect();
//     const { uuid, target } = await request.json();

//     if (!uuid || !target) {
//       return NextResponse.json(
//         { error: "UUID and target are required" },
//         { status: 400 }
//       );
//     }

//     // Check if user already exists
//     const existingUser = await TargetedUser.findOne({ uuid, target });
//     console.log("new user", existingUser, uuid, target);

//     if (existingUser && existingUser?.target === target) {
//       return NextResponse.json({
//         success: true,
//         exists: true,
//         data: existingUser,
//       });
//     }

//     // Create new targeted user
//     const newUser = await TargetedUser.create({ uuid, target });

//     return NextResponse.json({
//       success: true,
//       exists: false,
//       data: newUser,
//     });
//   } catch (error: any) {
//     console.error("Targeted user error:", error);
//     // Handle duplicate key error
//     if (error.code === 11000) {
//       return NextResponse.json({
//         success: true,
//         exists: true,
//         error: "User already exists for this target",
//       });
//     }
//     return NextResponse.json(
//       { error: "Failed to process targeted user" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: Request) {
//   try {
//     await dbConnect();
//     const { uuid, target } = await request.json();

//     if (!uuid || !target) {
//       return NextResponse.json(
//         { error: "UUID and target are required" },
//         { status: 400 }
//       );
//     }

//     // Check if user already exists with both uuid AND target
//     const existingUser = await TargetedUser.findOne({ uuid, target });
//     console.log("existing user check", existingUser, uuid, target);

//     if (existingUser) {
//       // Both uuid and target match - return existing user
//       return NextResponse.json({
//         success: true,
//         exists: true,
//         data: existingUser,
//       });
//     }

//     // Create new targeted user (either UUID doesn't exist, or exists with different target)
//     const newUser = await TargetedUser.create({ uuid, target });

//     return NextResponse.json({
//       success: true,
//       exists: false,
//       data: newUser,
//     });
//   } catch (error: any) {
//     console.error("Targeted user error:", error);
//     // Handle duplicate key error (shouldn't happen with proper logic, but safety net)
//     if (error.code === 11000) {
//       return NextResponse.json({
//         success: true,
//         exists: true,
//         error: "User already exists for this target",
//       });
//     }
//     return NextResponse.json(
//       { error: "Failed to process targeted user" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { uuid, target } = await request.json();

    if (!uuid || !target) {
      return NextResponse.json(
        { error: "UUID and target are required" },
        { status: 400 }
      );
    }

    // Use findOneAndUpdate with upsert to handle race conditions atomically
    const result = await TargetedUser.findOneAndUpdate(
      { uuid, target }, // Find document with both uuid and target
      {
        uuid,
        target,
        $setOnInsert: { createdAt: new Date() }, // Only set createdAt if inserting
      },
      {
        upsert: true, // Create if doesn't exist
        new: true, // Return the updated/created document
        setDefaultsOnInsert: true, // Apply schema defaults on insert
      }
    );

    console.log("upsert result", result, uuid, target);

    // Check if this was a new creation or existing document
    const isNewDocument = result.createdAt.getTime() > Date.now() - 1000; // Created within last second

    return NextResponse.json({
      success: true,
      exists: !isNewDocument,
      data: result,
    });
  } catch (error: any) {
    console.error("Targeted user error:", error);
    // Handle duplicate key error (shouldn't happen with proper logic, but safety net)
    if (error.code === 11000) {
      return NextResponse.json({
        success: true,
        exists: true,
        error: "User already exists for this target",
      });
    }
    return NextResponse.json(
      { error: "Failed to process targeted user" },
      { status: 500 }
    );
  }
}

// GET endpoint to get count of users for a specific target
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const target = searchParams.get("target");

    if (!target) {
      return NextResponse.json(
        { error: "Target parameter is required" },
        { status: 400 }
      );
    }

    const count = await TargetedUser.countDocuments({ target });
    const result = await Interaction.aggregate([
      { $match: { target } },
      {
        $facet: {
          totalCount: [{ $count: "count" }],
          data: [{ $sort: { timestamp: -1 } }, { $limit: 1000 }],
        },
      },
    ]);

    const totalCount = result[0].totalCount[0]?.count || 0;
    const limitedData = result[0].data;

    // const interactionCount = await Interaction.countDocuments({ target });
    const interactions = await Interaction.find()
      .sort({ timestamp: -1 }) // Sort by newest first
      .limit(1000);

    return NextResponse.json({
      success: true,
      target,
      interactionCount: totalCount,
      limitedData,
      count,
    });
  } catch (error) {
    console.error("Targeted user count error:", error);
    return NextResponse.json(
      { error: "Failed to get targeted user count" },
      { status: 500 }
    );
  }
}
