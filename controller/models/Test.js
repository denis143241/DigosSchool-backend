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

// module.exports.TITLE_SALT = "usertests";
// module.exports.TITLE_SEPARATOR = "_";

// module.exports.getTestsInBook = async user => {
//   const tests = await Test.find({title: {$in: [...user.book]}})
//   return tests
// };
