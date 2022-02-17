const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const { check, validationResult } = require("express-validator");
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

module.exports = router