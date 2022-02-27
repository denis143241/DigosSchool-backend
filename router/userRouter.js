const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const User = require("../controller/models/User")

const router = express.Router();

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
            name: user.name,
            login: user.login,
            language: user.language,
          },
        });
      } else return res.json({ success: false, message: "Неверный пароль" });
    });
  });
});

router.get("/", authMiddleware, (req, res) => {
  User.findById(req.user._id, async (err, u) => {
    if (err) return res.status(400)
    await u.populate("courses")
    res.json(u)
  })
})

router.post("/add-course", authMiddleware, (req, res) => {
  User.addCourse(req.body.courseId, req.user, (err, isMatch) => {
    if (err) return res.status(400).json({success: isMatch, message: "Неудалось добавить курс", err})
    res.json({success: true, message: "Курс успешно добавлен"})
  })
})

module.exports = router