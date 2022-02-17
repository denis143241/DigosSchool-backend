const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const { check, validationResult } = require("express-validator");
const User = require("../controller/models/User")

const router = express.Router();

router.post("/create", authMiddleware, (req, res) => {
    if (!req.user.roles.includes("ADMIN"))
      return res
        .status(403)
        .json({ success: false, message: "У вас нет прав Администратора!" });
    let newTest = new Test({
      title: req.body.title,
      category: req.body.category,
      language: req.body.language,
      words: req.body.words,
    });
  
    Test.getTestByTitle(newTest.title, (err, test) => {
      if (err) {
        return res.json({
          succes: false,
          message: "Произошла ошибка! Проверьте введенные данные.",
        });
      }
  
      Test.addTest(newTest, (err, test) => {
        if (err) {
          return res.json({
            succes: false,
            message: "Не удалось добавить тест, проверьте введенные данные!",
          });
        }
        res.json({ succes: true, message: "Админ тест успешно добавлен!" });
      });
    });
  });
  

module.exports = router;