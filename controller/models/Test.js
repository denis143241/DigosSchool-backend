const mongoose = require("mongoose");

const TestScheme = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  master: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  isGeneral: {
    type: Boolean,
    required: true,
  },
  words: {
    type: Object,
    required: true,
  },
});

const Test = (module.exports = mongoose.model("Test", TestScheme));

// module.exports.getTestByTitle = async (title, callback) => {
//   const query = { title };
//   await Test.findOne(query, callback);
// };

module.exports.addTest = async (newTest, callback) => {
  await newTest.save(callback);
};

/**
 * Возвращает из базы найденные тесты с соответствующей категорией
 * 
 * @param {String} category
 * @param {Function} callback
 */
module.exports.getTestsByCategory_admin = (category, callback) => {
  Test.find({$and: [{category: category}, {isGeneral: true}]}, callback)
}

/**
 * Возвращает тест найденный среди общих или null
 * 
 * @param {String} testId 
 * @param {Function} callback 
 */
module.exports.getFromGeneral = (testId, callback) => {
  Test.find({$and: [{_id: testId}, {isGeneral: true}]}, callback)
}

/**
 * Возвращает тест либо из общей базы либо личный тест пользователя
 * 
 * @param {String} testId 
 * @param {String} userId 
 * @param {Function} callback 
 */
module.exports.getFromGeneral_and_Own = (testId, userId, callback) => {
  Test.find({$or: [{$and: [{_id: testId}, {isGeneral: true}]}, {$and: [{_id: testId}, {master: userId}]}]}, callback)
}

// module.exports.TITLE_SALT = "usertests";
// module.exports.TITLE_SEPARATOR = "_";

// module.exports.getTestsInBook = async user => {
//   const tests = await Test.find({title: {$in: [...user.book]}})
//   return tests
// };
