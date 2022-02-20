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

module.exports.getCourseById = (id, callback) => {
  Course.findById(id, callback)
}

module.exports.addTest = (courseId, testId, callback) => {
  // Тут 2 раза идет обращение к БД, в будущем это стоит переписать
  Course.findById(courseId, (err, course) => {
    if (err) throw err

    Course.updateOne({_id: courseId}, {$set: {tests: [...course.tests, testId]}}, callback)
  })
}
