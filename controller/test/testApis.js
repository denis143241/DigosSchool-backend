// const express = require("express")
// const Course = require("../models/Course")

// const router = express.Router();

// router.post("/test/course", (req, res) => {
//     newCourse = new Course({
//         creator: "61db0556d71411b311f5e512",
//         tests: ["61ed63caa5df7caa5e56cc86"],
//         name: "ПРИ-120",
//     })
//     Course.createCourse(newCourse, (err, c) => {
//         if (err) return res.sendStatus(400).json({success: false, message: "Не удалось создать курс"})
//         res.json(c)
//     })
// })

// module.exports = router;