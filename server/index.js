const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const authRouter = require("./routes/auth.routes");
const mainRouter = require("./routes/main.routes");

// Создаем сервер
const app = express()
const PORT = config.get('serverPort')
const corsMiddleware = require('./middleware/cors.middleware')

app.use(corsMiddleware)
app.use(express.json())
// Указываем ссылку, по которой роутер авторизации будет обрабатываться
app.use("/api/auth", authRouter)
app.use("/", mainRouter)

// Функция которая подключается к БД и запускает сервер
const start = async () => {
    try {
        // Подключние к БД
        await mongoose.connect(config.get('dbUrl'), {useNewUrlParser: true, useUnifiedTopology: true})

        // Создание сервера
        app.listen(PORT, () => {
            console.log('Server started on port ', PORT)
        })
    } catch(e) {

    }
}

start()
