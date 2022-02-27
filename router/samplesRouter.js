const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const Course = require("../controller/models/Course")
const User = require("../controller/models/User")

const router = express.Router();

/**
 * Возвращает участников курса для создателя курса если запрашивает создатель
 * В противном случае возвращает отклонение
 * 
 * @param {import("mongoose").ObjectId} courseId айди курса, по которому производится поиск участников. 
 */
router.get("/course-members", authMiddleware, (req, res) => {
    Course.getCourseById(req.body.courseId, async (err, course) => {
        if (err) return res.status(400).json({success: false, message: "Проблемы при поиске курса в БД"})

        if (course.creator.toString() !== req.user._id) return res.json({success: false, message: "У вас нет на это прав!"})

        const rightUsers = await User.getUserByCourse_many(req.body.courseId)
        res.json({usres: rightUsers})
    })
})

module.exports = router;