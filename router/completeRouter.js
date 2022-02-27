const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const Completed = require("../controller/models/Completed")

const router = express.Router();

/**
 * Добавляет пройденный тест в таблицу пройденных тестов в БД
 * Только для авторизированных пользователей - Токен обязательно
 * 
 * @param {number} score
 * @param {import("mongoose").ObjectId} testId
 * @param {import("mongoose").Date} date
 */
router.post("/add", authMiddleware, async (req, res) => {
    const model = new Completed({
        master: req.user._id,
        test: req.body.testId,
        Score: req.body.score,
        Date: req.body.date
    })
    await model.save()
    res.json({success: true, message: "Результат успешно сохранен"})
})

module.exports = router;