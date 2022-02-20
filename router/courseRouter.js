const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const Course = require("../controller/models/Course");

const router = express.Router();

router.post("/create", authMiddleware, (req, res) => {
    const newCourse = new Course({
        ...req.body,
        creator: req.user._id
    })
    Course.createCourse(newCourse, (err, isMatch) => {
        if (err) return res.send(400).json({success: false, message: "Ошибка при создании курса"})
        res.json({success: true, message: "Курс успешно создан"})
    })
})

router.get("/", (req, res) => {
    Course.getCourseById(req.body.courseId, async (err, course) => {
        await course.populate("tests")
        await course.populate("creator")
        res.json(course)
    })

})

router.post("/add-test", authMiddleware, (req, res) => {
    Course.addTest(req.body.courseId, req.body.testId, (err, isMatch) => {
        if (err) res.status(400).json({success: false})
        res.json({success: true, message: "Тест успешно добавлен к курсу"})
    })
})

module.exports = router