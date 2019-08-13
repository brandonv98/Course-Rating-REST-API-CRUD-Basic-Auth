const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReviewsSchema = new Schema({
  user: {
    _id: String
  },
  postedOn: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    default: 0
  },
  review: {
    type: String
  }
});

ReviewsSchema.pre("save", function (next) {
  next();
});

const Reviews = mongoose.model("Reviews", ReviewsSchema);

module.exports.Reviews = Reviews;