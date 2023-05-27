const {Schema, model} = require("mongoose")

const Stat = new Schema({
    date: {type: String, required: true},
    value: {type: Number, required: true},
})

module.exports = model("Stat", Stat)
