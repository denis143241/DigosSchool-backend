const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
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
  

module.exports = router;