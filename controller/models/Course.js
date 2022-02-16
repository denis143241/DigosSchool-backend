const mongoose = require("mongoose");

const CourseScheme = mongoose.Schema({
  creator: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  tests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      unique: true,
    },
  ],
  name: {
    type: String,
    required: true,
  },
});

const Course = (module.exports = mongoose.model("Course", CourseScheme));

module.exports.createCourse = (newCourse, callback) => {
  newCourse.save(callback);
};
