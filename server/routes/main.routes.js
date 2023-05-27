const Router = require("express");
const Data = require("../models/Data");
const Stat = require("../models/Statistics");

const router = new Router()

// Workshops data ===========================================================================================
router.get('/',
    async (req, res) => {
        try {
            const data = await Data.find()
            return res.json(data)
        } catch (e) {
            console.log(e)
            res.send({message: "Server error"})
        }
    })

// Statistics data =============================================================================================
router.post('/stat',
    async (req, res) => {
        try {
            const {date, value} = req.body

            // Cохраняем данные
            const data = new Stat({date, value})
            await data.save()
            return res.json({message: "Data added"})
        } catch (e) {
            console.log(e)
            res.send({message: "Server post data error"})
        }
    })

router.get('/stat',
    async (req, res) => {
        // по req обрабатывать что именно надо ?
        try {
            const data = await Stat.find()
            return res.json(data)
        } catch (e) {
            console.log(e)
            res.send({message: "Server error"})
        }
    })


module.exports = router
