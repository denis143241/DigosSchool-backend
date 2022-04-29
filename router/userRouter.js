const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const User = require("../controller/models/User")

const router = express.Router();

/**
 * Регистрация пользователя
 * 
 * @param {String} login
 * @param {String} password
 * @param {String} username
 * @param {String} language
 */
router.post("/reg",
  // middleware
  [
    check("login", "Логин не может быть пустым").notEmpty(),
    check(
      "password",
      "Пароль должен быть больше 3 и меньше 18 символов"
    ).isLength({ max: 17, min: 4 }),
  ],

  (req, res) => {
    // Блок обработки ошибок с middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Ошибка при регистрации", err: errors });
    }
    // Создание и добавление Юзера (по умолчанию по этому URL)
    let newUser = new User({ ...req.body, roles: "USER" });
    User.addUser(newUser, (err, user) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message:
            "При создании пользователя произошла ошибка. Проверьте правильность введенных данных",
        });
      }
      res.json({ success: true, message: "Пользователь был добавлен" });
    });
  }
);

/**
 * @param {String} login
 * @param {String} password
 * 
 * @returns {Object} {success, message?, token, user: {id, username, language}}
 */
router.post("/auth", (req, res) => {
  const { login, password } = req.body;

  // Поиск Пользователя по логину
  User.getUserByLogin(login, (err, user) => {
    if (err) throw err;
    if (!user) {
      // Пользователь не найден
      return res.json({
        success: false,
        message: "Такой пользователь был не найден",
      });
    }

    // Пользователь найден
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign(user.toJSON(), db.secret, {
          expiresIn: "24h",
        });

        res.json({
          success: true,
          token,
          user: {
            id: user._id,
            username: user.username,
            language: user.language,
          },
        });
      } else return res.json({ success: false, message: "Неверный пароль" });
    });
  });
});
'somesomesome'
router.get("/", authMiddleware, (req, res) => {
  User.findById(req.user._id, {password: 0, login: 0}, async (err, u) => {
    if (err) return res.status(400)
    await u.populate("courses")
    res.json(u)
  })
})

router.get("/uesrs-by-username/:row/:amount", (req, res) => {
  User.getUsersByUsername(req.params.row, req.params.amount, (err, result) => {
    if (err) {
      res.status(403).json({success: false, message: "Произошла ошибка при поиске пользователей."})
    }

    res.json(result)
  })
})

router.get("/courses", authMiddleware, (req, res) => {
  User.findById(req.user._id, {courses: 1, _id: 0}, async (err, result) => {
    if (err) return res.status(400)
    await result.populate("courses")
    for (let c of result.courses) {
      await c.populate("creator", {username: 1, _id: 0})
    }
    res.json([...result.courses])
  })
})

router.post("/add-course", authMiddleware, (req, res) => {
  User.addCourse(req.body.courseId, req.user, (err, isMatch) => {
    if (err) return res.status(400).json({success: isMatch, message: "Неудалось добавить курс", err})
    res.json({success: true, message: "Курс успешно добавлен"})
  })
})

router.get("/roles", authMiddleware, (req, res) => {
  res.json({roles: req.user.roles})
})

router.get("/book", authMiddleware, (req, res) => {
  User.getBook(req.user._id, async (err, book) => {
    if (err) {
      return res.status(403).json({success: false, message: "Произошла непредвиденная ошибка с нашей стороны, приносим свои извинения :("})
    }
    await book.populate("book")
    return res.json(book)
  })
})

router.post("/book/add/:id", authMiddleware, (req, res) => {
  User.addToBook(req.user._id, req.params.id, (err, isMatch) => {
    if (err) {
      return res.status(403).json({success: false, message: "Произошла непредвиденная ошибка с нашей стороны, приносим свои извинения :("})
    }
    return res.json({success: true, message: "Тест был успешно добавлен в вашу книгу"})
  })
})

router.get("/book/:id", authMiddleware, (req, res) => {
  User.getBook(req.user._id, async (err, result) => {
    if (err) {
      return res.status(403).json({success: false, message: "Произошла непредвиденная ошибка с нашей стороны, приносим свои извинения :("})
    }
    await result.populate("book")
    test = result.book.find(obj => obj._id == req.params.id)
    if (!test) {
      return res.json(false)
    }
    res.json(test)
  })
})

router.post("/book/delete/:id", authMiddleware, (req, res) => {
  User.deleteFromBook(req.user._id, req.params.id, (err, isMatch) => {
    if (err) {
      return res.status(403).json({success: false, message: "Произошла непредвиденная ошибка с нашей стороны, тест не был удален. Пожалуйста обновите страницу"})
    }

    return res.json({success: true, message: "Ваш тест был успешно удален"})
  })
})

router.get("/tests", authMiddleware, (req, res) => {
  User.getOwnTests(req.user._id, (err, tests) => {
    if (err) {
      return res.status(403).json({success: false, message: "Что-то пошло не так при поиске ваших тестов. Пожалуйста попробуйте снова."})
    }
    return res.json(tests)
  })
})

module.exports = router