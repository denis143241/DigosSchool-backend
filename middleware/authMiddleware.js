const jwt = require("jsonwebtoken");
const { secret } = require("../config/db");

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") next();

  try {
      const token = req.headers.authorization.split(' ')[1]
      if (!token) {
        return res
        .status(403)
        .json({ success: false, message: "Пользователь не авторизован!" });      
      }
      const decodedDataa = jwt.verify(token, secret)
      req.user = decodedDataa;
      next();
  } catch (e) {
    console.log(e);
    return res
      .status(403)
      .json({ success: false, message: "Пользователь не авторизован!" });
  }
};
