add on root durectory folder 'config' and then create there file db.js

db.js includes:
    module.exports = {
        db: "mongodb://localhost:27017/your repo",
        secret: "/your hash/"
}
