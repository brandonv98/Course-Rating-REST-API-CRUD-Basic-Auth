const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  postedOn: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    default: 0,
    required: true,
		min: 1,
		max: 5
  },
  review: {
    type: String
  }
});

// ReviewSchema.pre("save", function (next) {
//   next();
// });

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;