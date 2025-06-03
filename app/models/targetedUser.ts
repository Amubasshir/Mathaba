// // import mongoose from "mongoose";

// // const targetedUserSchema = new mongoose.Schema({
// //   uuid: {
// //     type: String,
// //     required: true,
// //     unique: true,
// //   },
// //   target: {
// //     type: String,
// //     required: true,
// //   },
// //   createdAt: {
// //     type: Date,
// //     default: Date.now,
// //   },
// // });

// // // Create compound index for uuid and target
// // targetedUserSchema.index({ uuid: 1, target: 1 }, { unique: true });

// // // Create model if it doesn't exist
// // const TargetedUser =
// //   mongoose.models.TargetedUser ||
// //   mongoose.model("TargetedUser", targetedUserSchema);

// // export default TargetedUser;

// import mongoose from "mongoose";

// const targetedUserSchema = new mongoose.Schema({
//   uuid: {
//     type: String,
//     required: true,
//     // Removed unique: true from uuid since we want compound uniqueness
//   },
//   target: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Create compound index for uuid and target combination to be unique
// targetedUserSchema.index({ uuid: 1, target: 1 }, { unique: true });

// // Create model if it doesn't exist
// const TargetedUser =
//   mongoose.models.TargetedUser ||
//   mongoose.model("TargetedUser", targetedUserSchema);

// export default TargetedUser;

// !3rd

import mongoose from "mongoose";

const targetedUserSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    // Removed unique: true from uuid since we want compound uniqueness
  },
  target: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create compound index for uuid and target combination to be unique
targetedUserSchema.index({ uuid: 1, target: 1 }, { unique: true });

// Create model if it doesn't exist
const TargetedUser =
  mongoose.models.TargetedUser ||
  mongoose.model("TargetedUser", targetedUserSchema);

// Function to ensure indexes are properly set up
export const ensureIndexes = async () => {
  try {
    // Drop the old uuid unique index if it exists
    try {
      await TargetedUser.collection.dropIndex("uuid_1");
      console.log("Dropped old uuid_1 index");
    } catch (error) {
      // Index might not exist, ignore error
      console.log("uuid_1 index not found or already dropped");
    }
    
    // Ensure our compound index exists
    await TargetedUser.createIndexes();
    console.log("Indexes ensured");
  } catch (error) {
    console.error("Error managing indexes:", error);
  }
};

export default TargetedUser;