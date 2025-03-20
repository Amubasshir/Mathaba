import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema(
  {
    id: String,
    userId: String,
    timestamp: Date,
    userInput: String,
    assistantResponse: String,
    language: String,
    source: String,
    sessionId: String,
    threadId: String,
    location: {
      city: String,
      country: String,
      countryCode: String,
    },
  },
  {
    timestamps: true,
  }
);

// Delete existing model if it exists (for development)
if (mongoose.models.Interaction) {
  delete mongoose.models.Interaction;
}

export const Interaction = mongoose.model('Interaction', interactionSchema);
