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
  name: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  book: {
    type: Array,
    required: false,
    unique: true
  },
  ownBook: {
    type: Array,
    required: false,
    unique: true
  },
  ownTests: [
    {
      type: Object,
      ref: "Test",
    },
  ],
  roles: [
    {
      type: String,
      ref: "Role",
    },
  ],
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
    console.log(isMatch);
    callback(null, isMatch);
  });
};

module.exports.addOwnTest = (test, user, callback) => {
  User.getUserByLogin(user.login, async (err, u) => {
    console.log(u);
    if (err) return callback(err, false);
    const tests = [...u.ownTests, test];
    console.log(tests);
    await User.updateOne(
      { login: u.login },
      { $set: { ownTests: tests } },
      callback
    );
    console.log(u);
  });
};

module.exports.getAllOwnTests = (user, callback) => {
  User.getUserByLogin(user.login, (err, u) => {
    if (err) return callback(err, null)
    callback(null, u.ownTests)
  })
}

module.exports.getOwnTest = (title, user, callback) => {
  User.getUserByLogin(user.login, (err, u) => {
    if (err) throw err;
    const test = u.ownTests.find((test) => test.title === title);
    callback(null, test);
  });
};

module.exports.getUserTests = (user) => {
  let output = []
  user.ownBook.forEach(title => {
    const foundTest = user.ownTests.find(test => test.title === title)
    if (foundTest) {
      output.push(foundTest)
    }
  })
  return output
}

module.exports.deleteFromUserBook = (user, title, callback) => {
  const newOwnBook = user.ownBook.filter(t => t !== title)
  User.updateOne({login: user.login}, {$set: {ownBook: newOwnBook}}, callback)
}

module.exports.deleteFromBook = (user, title, callback) => {
  const updatedBook = user.book.filter(t => t !== title)
  User.updateOne({login: user.login}, {$set: {book: updatedBook}}, callback)
}
