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
      enum: [
        'ar',
        'bn',
        'en',
        'fr',
        'fa',
        'ms',
        'ur',
        'tr',
        'id',
        'ha',
        'es',
        'ru',
        'si',
        'am',
        'my',
        'hi',
        'uz',
      ],
    },
    ageRange: {
      type: String,
      required: true,
      enum: ['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female'],
    },
    nationality: {
      type: String,
      required: true,
      enum: [
        'Afghanistan',
        'Albania',
        'Algeria',
        'Azerbaijan',
        'Bahrain',
        'Bangladesh',
        'Brunei',
        'Burkina Faso',
        'Chad',
        'Comoros',
        'France',
        'Djibouti',
        'Egypt',
        'Gambia',
        'Guinea',
        'Indonesia',
        'India',
        'Iran',
        'Iraq',
        'Jordan',
        'Kazakhstan',
        'Kuwait',
        'Kyrgyzstan',
        'Lebanon',
        'Libya',
        'Malaysia',
        'Maldives',
        'Mali',
        'Mauritania',
        'Morocco',
        'Niger',
        'Nigeria',
        'Oman',
        'Pakistan',
        'Palestine',
        'Qatar',
        'Saudi Arabia',
        'Senegal',
        'Sierra Leone',
        'Somalia',
        'Spain',
        'Sudan',
        'Syria',
        'Tajikistan',
        'Tunisia',
        'Turkey',
        'Turkmenistan',
        'United Arab Emirates',
        'Uzbekistan',
        'Yemen',
      ],
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
