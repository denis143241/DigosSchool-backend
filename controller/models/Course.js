const mongoose = require("mongoose");
const User = require("./User")
const Completed = require("./Completed")

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

/**
 * Возвращает таблицу лидеров определенного курса
 * 
 * @param {import("mongoose").ObjectId} courseId
 * @param {function} callback
 */
module.exports.liderboard = async (courseId, callback) => {
  const output = []

  await Course.findById(courseId, async (err, c) => {
    if (err) throw err

    const users = await User.getUserByCourse_many(courseId)

    for (let i = 0; i < users.length; i++) {
      let u = users[i]
      let userCompletes = await Completed.find({$and: [{master: u._id}, {test: {$in: c.tests}}]}, {_id: 0, Score: 1, test: 1})
      userCompletes = remainSuccessfulyAttemp(userCompletes)
      let totalScore = 0
      if (userCompletes.length > 0) {
        totalScore = userCompletes.map(el => el[1]).reduce((total, current) => total + current)
      }
      output.push({user: u.username, totalScore})
    }
    callback(output)
  })
}

/**
 * @param {Array} arr [{test: ObjectId, Score: Number}, ...]
 * @returns {Array} Object.entries
 */
function remainSuccessfulyAttemp(arr) {
  const dict = {}
  arr.forEach(el => {
    dict[el.test] = dict[el.test] ? Math.max(dict[el.test], el.Score) : el.Score
  })
  return Object.entries(dict)
}

/**
 * Выдает подробную информацию о пройденных тестах в определенном курсе 
 * Только для преподавателя курса.
 * 
 * @param {import("mongoose").ObjectId} courseId ID курса.
 * @param {import("mongoose").ObjectId} userId ID пользователя.
 * @param {Function} callback callback.
 * 
 * @returns {Array} [{user: {_id, username, email} completes: [{test: {_id, title}, Score: Number}]}]
 */
module.exports.getPassingCourseInfo = async (courseId, userId, callback) => {
  const output = []

  await Course.findById(courseId, async (err, c) => {
    if (err) throw err

    if (userId.toString() !== c.creator.toString()) {
      console.log(c.creator)
      return callback(null)
    }

    const users = await User.getUserByCourse_many(courseId)

    for (let i = 0; i < users.length; i++) {
      let u = users[i]
      let userCompletes = await Completed.find({$and: [{master: u._id}, {test: {$in: c.tests}}]}, {_id: 0, Score: 1, test: 1}).populate("test", "title")
      
      output.push({user: u, completes: [...userCompletes]})
    }
    callback(output)
  })
}