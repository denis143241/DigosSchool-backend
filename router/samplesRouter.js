const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const Course = require("../controller/models/Course")
const User = require("../controller/models/User")

const router = express.Router();

router.get("/course-members", authMiddleware, (req, res) => {
    // Входные данные {courseId}
    Course.getCourseById(req.body.courseId, (err, course) => {
        if (err) return res.status(400).json({success: false, message: "Проблемы при поиске курса в БД"})

        // Только создатель курса может получать подробную информацию об участниках курса
        // course.creator return ObjectId!
        if (course.creator.toString() !== req.user._id) return res.json({success: false, message: "У вас нет на это прав!"})

        res.json({message: "Тут будет код"})
    })
})

module.exports = router;