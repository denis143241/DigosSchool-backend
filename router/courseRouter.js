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

module.exports = router