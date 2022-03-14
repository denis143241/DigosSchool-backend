const jwt = require("jsonwebtoken");
const { secret } = require("../config/db");

/**
 * Проверяет авторизирован ли пользователь, если нет то возвращает 
 * req.user = null, иначе req.user = UserObject
 */
module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") next();

  try {
      const token = req.headers.authorization.split(' ')[1]
      if (token == 'null' || !token) {
        req.user = null  
        return next();
      }

      const decodedDataa = jwt.verify(token, secret)
      req.user = decodedDataa;
      next();
  } catch (e) {
    console.log(e);
    return req.user = null
  }
};
