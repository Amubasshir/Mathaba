import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    message: {
      type: String,
      required: false,
    },
    language: {
      type: String,
      required: true,
      enum: ['en', 'ar'],
    },
    ageRange: {
      type: String,
      required: true,
      enum: ['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    },
    location: {
      type: {
        latitude: Number,
        longitude: Number,
        city: String,
        country: String,
      },
      required: false,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Delete the model if it exists to prevent OverwriteModelError
if (mongoose.models.Feedback) {
  delete mongoose.models.Feedback;
}

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
