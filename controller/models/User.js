const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const res = require("express/lib/response");

const SALT_ROUNDS = 10;

const UserScheme = mongoose.Schema({
  login: {
    type: String,
    reqired: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  book: [{ type: mongoose.Schema.Types.ObjectId, ref: "Test", unique: true }],
  roles: [
    {
      type: String,
      ref: "Role",
    },
  ],
  email: {
    type: String,
  },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course", unique: true }],
  completed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Completed", unique: true }]
});

const User = (module.exports = mongoose.model("User", UserScheme));

module.exports.addUser = (newUser, callback) => {
  bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
    if (err) return console.log(`Проверьте пароль (${err})`);
    bcrypt.hash(newUser.password, salt, async (err, hash) => {
      if (err)
        return console.log(`Что то пошло не так при хешировании (${err})`);
      newUser.password = hash;
      await newUser.save(callback);
    });
  });
};

module.exports.getUserByLogin = (login, callback) => {
  const query = { login };
  User.findOne(query, callback);
};

module.exports.comparePassword = async (userPassword, dbPassword, callback) => {
  await bcrypt.compare(userPassword, dbPassword, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};

module.exports.addCourse = (courseId, user, callback) => {
  User.updateOne({_id: user._id}, {$set: {courses: [...user.courses, courseId]}}, callback)
}

module.exports.getUserByCourse_many = (courseId) => {
  // Выборка из БД всех пользователей которые имеют доступ к courseId
}
