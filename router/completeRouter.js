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

/**
 * Для авторизированных пользователей возращает список пройденных тестов
 */
router.get("/get_by_user", authMiddleware, (req, res) => {
    Completed.getByUser(req.user._id, async (err, result) => {
        if (err) res.status(400).json({success: false, message: "Произошла ошибка при поиске завершенных тестов"})
        for (let i = 0; i < result.length; i++) {
            await result[i].populate("test")
        }
        res.json({completed: result})
    })
})

module.exports = router;