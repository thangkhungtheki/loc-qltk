const mongooge = require("mongoose")
const Schema = mongooge.Schema
const bcrypt = require("bcrypt")
const schema = new Schema({
    Ma: {type: String, required: true},
    UGDN: {type: String, required: false},
    serial: {type: String, required: false},
    email: {type: String, required: false},
    Mainboard: {type: String, required: false},
    RAM: {type: String, required: true},
    CPU: {type: String, required: false},
    HardDisk: {type: String, required: false},
    Monitor: {type: String, required: false},
    Nguoidung: {type: String, required: false},
    BoPhan: {type: String, required: false},
    Loai: {type: String, required: false},
    headcount: {type: String, required: false},
    noilamviec: {type: String, required: false},
    ngaymua: {type: String, required: false},
    sothang: {type: String, required: false},
    OS: {type: String, required: false},
    dexuat: {type: String, required: false},
    software: {type: String, required: false},
    notes: {type: String, required: false},
    hethan: {type: String, required: false},
})


module.exports = mongooge.model('thietbi', schema, 'thietbi')