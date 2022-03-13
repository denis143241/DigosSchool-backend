// const express = require("express");
// const Test = require("./models/Test");
// const User = require("./models/User");
// const Course = require("./models/Course")
// const jwt = require("jsonwebtoken");
// const db = require("../config/db");
// const authMiddleware = require("../middleware/authMiddleware");
// const { check, validationResult } = require("express-validator");
// const { status, json } = require("express/lib/response");

// const router = express.Router();

// router.post("/create-admin-lesson", authMiddleware, (req, res) => {
//   // Проверка на админа. Создание модели. Проверка на то есть ли такой тест в БД (по назваонию теста). Уникальные тесты попадают в БД.
//   if (!req.user.roles.includes("ADMIN"))
//     return res
//       .status(403)
//       .json({ success: false, message: "У вас нет прав Администратора!" });
//   let newTest = new Test({
//     title: req.body.title,
//     category: req.body.category,
//     language: req.body.language,
//     words: req.body.words,
//   });

//   Test.getTestByTitle(newTest.title, (err, test) => {
//     if (err) {
//       return res.json({
//         succes: false,
//         message: "Произошла ошибка! Проверьте введенные данные.",
//       });
//     }

//     Test.addTest(newTest, (err, test) => {
//       if (err) {
//         return res.json({
//           succes: false,
//           message: "Не удалось добавить тест, проверьте введенные данные!",
//         });
//       }
//       res.json({ succes: true, message: "Админ тест успешно добавлен!" });
//     });
//   });
// });

// router.post("/create-user-lesson", authMiddleware, async (req, res) => {
//   // В данный момент нет проверок на одинаковые тесты.
//   const newTest = new Test({
//     title: req.body.title,
//     category: req.body.category,
//     language: req.body.language,
//     words: req.body.words,
//   });
//   User.addOwnTest(newTest, req.user, (err, isMatch) => {
//     if (err) res.status(403).json(err);
//     res.json({ success: true, message: "Тест был успешно добавлен" });
//   });
// });

// router.get("/category/:category", async (req, res) => {
//   const category = req.params.category;
//   await Test.find({ category: category }, (err, tests) => {
//     if (err) return res.json({ succes: false, message: "Что-то пошло не так" });
//     res.json(tests);
//   });
// });

// router.get("/book", authMiddleware, (req, res) => {
//   User.getUserByLogin(req.user.login, async (err, user) => {
//     if (err)
//       return res
//         .status(403)
//         .json({ success: false, message: "Пользователь не найден" });
//     const testsOfGeneral = await Test.getTestsInBook(user)
//     const testOfUser = await User.getUserTests(user)
//     console.log(testsOfGeneral, testOfUser)
//     res.json({fromGeneral: testsOfGeneral, fromUser: testOfUser})
//   });
// });

// router.post("/add-to-book", authMiddleware, (req, res) => {
//   User.getUserByLogin(req.user.login, async (err, user) => {
//     if (err)
//       req
//         .status(403)
//         .json({ success: false, message: "Пользователь не найден" }, err);
//     if (user.book.includes(req.body.title)) {
//       return res.status(400).json({success: false, message: "Урок уже был добавлен!"})
//     }
//     const updatedBook = [...user.book, req.body.title];
//     await User.updateOne(
//       { login: user.login },
//       { $set: { book: updatedBook } }
//     );
//     res.json({ success: true, message: "Урок успешно добавлен" });
//   });
// });

// router.post("/delete-from-book", authMiddleware, (req, res) => {
//   User.deleteFromBook(req.user, req.body.title, (err, isMatch) => {
//     if (err) return res.status(403).json({success: false, message: "Произошла ошибка проверьте правильность введенных данных"})
//     res.json({success: true, message: `Тест ${req.body.title} успешно удален из книги`})
//   })
// })

// router.post("/add-to-own-book", authMiddleware, (req, res) => {
//   User.getUserByLogin(req.user.login, (err, user) => {
//     if (err) return res.status(403).json({success: false, message: "Пользователь не найден"})
//     const newOwnBook = [...user.ownBook, req.body.title]
//     console.log(newOwnBook);
//     User.updateOne({login: user.login}, {$set: {ownBook: newOwnBook}}, (err, isMatch) => {
//       if (err) return res.status(403).json({success: false, message: "При обновлении учебника произошла непредвиденная ошибка"})
//       res.json({success: true, message: "Тест успешно добавлен в учебник"})
//     })
//   })
// })

// router.post("/delete-from-own-book", authMiddleware, (req, res) => {
//   // Нужна проверка на title
//   User.deleteFromUserBook(req.user, req.body.title, (err, isMatch) => {
//     if (err) throw err;
//     res.json({success: true, message: "Успешно удален"})
//   })
// })

// router.get("/in-book/:title", authMiddleware, (req, res) => {
//   console.log(req.user)
//   Test.getTestByTitle(req.params.title, (err, test) => {
//     if (err)
//       return res
//         .status(403)
//         .json({ success: false, message: "Ошибка при поиске теста" });
//     const inBook = req.user.book.includes(test.title);
//     res.json({ inBook });
//   });
// });

// router.get("/in-own-book/:title", authMiddleware, (req, res) => {
//   // УДАЛИТЬ
//   User.getUserByLogin(req.user.login, (err, user) => {
//     if (err) throw err
//     const inBook = user.ownBook.find(title => title === req.params.title)
//     console.log(inBook)
//     res.json({inBook: inBook !== undefined})
//   })
// })

// router.get("/own-book", authMiddleware, (req, res) => {
//   User.getUserByLogin(req.user.login, (err, user) => {
//     if (err) throw err
//     return res.json({ownBook: user.ownBook})
//   })
// })

// router.get("/general-book", authMiddleware, (req, res) => {
//   User.getUserByLogin(req.user.login, (err, user) => {
//     if (err) return res.status(403).json({success: false, message: "Пользователь не найден"})
//     res.json({data: user.book})
//   })
// })

// router.get("/own-tests", authMiddleware, (req, res) => {
//   User.getAllOwnTests(req.user, (err, tests) => {
//     if (err)
//       return res
//         .status(403)
//         .json({ success: false, message: "Проверьте ваши данные" });
//     if (!tests)
//       return res.json({
//         success: true,
//         message: "У вас еще нет ни одного теста! Хотите создать?",
//       });
//     res.json(tests);
//   });
// });

// router.get("/own-test/:title", authMiddleware, (req, res) => {
//   User.getOwnTest(req.params.title, req.user, (err, test) => {
//     if (err)
//       return status(404).json({
//         success: false,
//         message: "Такого теста не существует, проверьте введенные вами данные",
//       });
//     return res.json({ success: true, test });
//   });
// });

// router.get("/test/:title", (req, res) => {
//   const title = req.params.title;
//   Test.getTestByTitle(title, (err, test) => {
//     if (err) return res.sendStatus(404);
//     res.json(test);
//   });
// });

// router.post("/reg",
//   // middleware
//   [
//     check("login", "Логин не может быть пустым").notEmpty(),
//     check(
//       "password",
//       "Пароль должен быть больше 3 и меньше 18 символов"
//     ).isLength({ max: 17, min: 4 }),
//   ],

//   (req, res) => {
//     // Блок обработки ошибок с middleware
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res
//         .status(400)
//         .json({ message: "Ошибка при регистрации", err: errors });
//     }
//     // Создание и добавление Юзера (по умолчанию по этому URL)
//     let newUser = new User({ ...req.body, roles: "USER" });
//     User.addUser(newUser, (err, user) => {
//       if (err) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "При создании пользователя произошла ошибка. Проверьте правильность введенных данных",
//         });
//       }
//       res.json({ success: true, message: "Пользователь был добавлен" });
//     });
//   }
// );

// router.post("/auth", (req, res) => {
//   const { login, password } = req.body;

//   // Поиск Пользователя по логину
//   User.getUserByLogin(login, (err, user) => {
//     if (err) throw err;
//     if (!user) {
//       // Пользователь не найден
//       return res.json({
//         success: false,
//         message: "Такой пользователь был не найден",
//       });
//     }

//     // Пользователь найден
//     User.comparePassword(password, user.password, (err, isMatch) => {
//       if (err) throw err;
//       if (isMatch) {
//         const token = jwt.sign(user.toJSON(), db.secret, {
//           expiresIn: "24h",
//         });

//         res.json({
//           success: true,
//           token,
//           user: {
//             id: user._id,
//             name: user.name,
//             login: user.login,
//             language: user.language,
//           },
//         });
//       } else return res.json({ success: false, message: "Неверный пароль" });
//     });
//   });
// });

// router.get("/profile", (req, res) => {
//   res.send("Кабинет пользователя");
// });

// router.get("/roles", authMiddleware, (req, res) => {
//   return res.json({roles: req.user.roles})
// })





// // Tests
// router.get("/test", (req, res) => {
//   Course.findOne({name: "ПРИ-120"}).populate("creator").exec((err, c) => {
//     if (err) console.log(err)
//     res.json(c)
//   })
// })
// router.post("/test/course", (req, res) => {
//   User.getUserByLogin("user", (err, user) => {
//     if (err) res.json({success: false});

//       newCourse = new Course({
//           creator: "ewfwf",
//           name: "ПРИ-220",
//       })
//       Course.createCourse(newCourse, (err, c) => {
//           if (err) return res.sendStatus(400).json({success: false, message: "Не удалось создать курс"})
//           res.json(c)
//       })
//   })
// })

// module.exports = router;
