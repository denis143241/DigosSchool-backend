const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const authMiddleware_light = require("../middleware/authMiddleware_light")
const Test = require("../controller/models/Test")

const router = express.Router();

router.post("/create", authMiddleware, (req, res) => {
    // Check user's rights on admin
    if (req.body.isGeneral === true && !req.user.roles.includes("ADMIN")) {
        return res.json({success: false, message: "У вас недостаточно прав для этого действия!"})
    }

    // Adding test to DB
    const newTest = new Test({...req.body})
    Test.addTest(newTest, (err, test) => {
        if (err) return res.status(400).json({success: false, message: "Ошибка при добавлении теста в БД", err})
        res.json({success: true, message: "Тест успешно добавлен"})
    })
});

router.get("/category/:category", (req, res) => {
    Test.getTestsByCategory_admin(req.params.category, (err, tests) => {
        if (err) {
            return res.status(403).json({success: false, message: "Произошла не предвиденная ошибка при поиске тестов"})
        }

        return res.json(tests);
    })
})

router.get("/:id", authMiddleware_light, (req, res) => {
    if (req.user === null) {
        Test.getFromGeneral(req.params.id, (err, test) => {
            if (err) {
                return res.status(403).json({success: false, message: "Произошла ошибка при поиске вашего теста"})
            }
            return res.json(...test)
        })
    }
    else {
        Test.getFromGeneral_and_Own(req.params.id, req.user._id, (err, test) => {
            if (err) {
                return res.status(403).json({success: false, message: "Произошла ошибка при поиске вашего теста"})
            }
            return res.json(...test)
        })
    }
})

module.exports = router;