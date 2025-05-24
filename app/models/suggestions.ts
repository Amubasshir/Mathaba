import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema(
  {
    questions_ar: { type: String, required: true },
    answers_ar: { type: String, required: true },
    questions_en: { type: String, required: true },
    answers_en: { type: String, required: true },
    questions_ur: { type: String, required: true },
    answers_ur: { type: String, required: true },
    questions_fr: { type: String, required: true },
    answers_fr: { type: String, required: true },
    questions_bn: { type: String, required: true },
    answers_bn: { type: String, required: true },
    questions_tr: { type: String, required: true },
    answers_tr: { type: String, required: true },
    questions_id: { type: String, required: true },
    answers_id: { type: String, required: true },
    URL: { type: String, required: true },
    Ref: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Create text indexes for efficient search across all question fields
suggestionSchema.index({
  questions_ar: "text",
  questions_en: "text",
  questions_ur: "text",
  questions_fr: "text",
  questions_bn: "text",
  questions_tr: "text",
  questions_id: "text",
});

// Delete the model if it exists to prevent OverwriteModelError
if (mongoose.models.Suggestion) {
  delete mongoose.models.Suggestion;
}

const Suggestion = mongoose.model("Suggestion", suggestionSchema);

export default Suggestion;
