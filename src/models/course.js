const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CoursesSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  user: {
    _id: String,
  },
  description: {
    type: String,
    required: true
  },
  estimatedTime: String,
  materialsNeeded: String,
  steps: [
    {
      stepNumber: Number,
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    },
  ],
  reviews: {
    steps: [
      {
        stepNumber: Number,
        title: String,
        description: String
      },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

CoursesSchema.pre("save", function (next) {
  next();
});

const Courses = mongoose.model("Courses", CoursesSchema);

module.exports.Courses = Courses;