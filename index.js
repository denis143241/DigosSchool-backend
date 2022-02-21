const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const configDB = require("./config/db")
const api = require("./controller/api")
const userRouter = require("./router/userRouter")
const testRouter = require("./router/testRouter")
const courseRouter = require("./router/courseRouter")
const samplesRouter = require("./router/samplesRouter")

const app = express()
const PORT = process.env.PORT || 8080

// built project has located there
app.use(express.static(path.join(__dirname ,"client-app/dist/")))

app.use(express.json())

app.use('/api', api)

// ------------------------------------------------------- There is a new API --------------------------------------------------------

app.use("/api/user", userRouter)
app.use("/api/test", testRouter)
app.use("/api/course", courseRouter)
app.use("/api/samples", samplesRouter)

// ------------------------------------------------------------------------------------------------------------------------------

mongoose.connect(configDB.db)

mongoose.connection.on('connected', () => {
  console.log("БД успешно запущена")
})

mongoose.connection.on("error", (err) => {
  console.log("ERROR: " + err)
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client-app/dist/index.html"))
})

try {
  app.listen(PORT, () => {
    console.log("Сервер запущен на порту " + PORT)
  })
} catch (e) {
  console.log(e)
}

