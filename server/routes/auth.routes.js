const Router = require("express");
const User = require("../models/User");
const Data = require("../models/Data");
const bcrypt = require("bcryptjs");
const config = require("config");
const {check, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken")
const authMiddleware = require('../middleware/auth.middleware')

const router = new Router()


router.post('/registration',
    // второй параметр
    [
        check('email', "Uncorrect email").isEmail(),
        check('password', "Password must be longer than 3 and shorter than 12").isLength({min:3, max:12})
    ],
    // Начало функции регистрации
    async (req, res) => {
    try {
        console.log(req.body)
        // Валидация
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({message: "Uncorrected request", errors})
        }

        const {email, password} = req.body
        const candidate = await User.findOne({email})

        // Обрабатываем случай, если email уже существует в базе
        if(candidate) {
            return res.status(400).json({message: `User with email ${email} already exist`})
        }

        // Если нет, то сохраняем пользователя
        const hashPassword = await bcrypt.hash(password, 6)
        const user = new User({email, password: hashPassword})
        await user.save()
        return res.json({message: "User was created"})

    } catch (e) {
        console.log(e)
        res.send({message: "Server error"})
    }
})

router.post('/login',
    //
    async (req, res) => {
        try {
            // Достаём данные пользователя
            const {email, password} = req.body

            // Пробуем найти пользователя
            const user = await User.findOne({email})

            // Если пользователь не найден
            if (!user) {
                return res.status(400).json({message: "User not found"})
            }

            // Пользователь найдён, сравниваем введённый пароль с паролем в БД
            const isPassValid = bcrypt.compareSync(password, user.password)

            // Обработчик, если не совпадают
            if (!isPassValid) {
                return res.status(400).json({message: "Invalid password"})
            }

            // Создаем токен
            const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"})
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace:  user.usedSpace,
                    avatar: user.avatar
                }
            })
        } catch (e) {
            console.log(e)
            res.send({message: "Server error"})
        }
})


router.get('/auth', authMiddleware,
    async (req, res) => {
        try {
            const user = await User.findOne({id: req.user.id})
            const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"})
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace:  user.usedSpace,
                    avatar: user.avatar
                }
            })
        } catch (e) {
            console.log(e)
            res.send({message: "Server error"})
        }
    })

router.get('/index.html',
    async (req, res) => {
        try {
            const data = await Data.find()
            return res.json(data)
        } catch (e) {
            console.log(e)
            res.send({message: "Server error"})
        }
    })

module.exports = router