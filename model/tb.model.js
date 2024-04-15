const mongooge = require("mongoose")
const Schema = mongooge.Schema
const bcrypt = require("bcrypt")
const schema = new Schema({
    Ma: {type: String, required: true},
    UGDN: {type: String, required: true},
    email: {type: String, required: true},
    serial: {type: String, required: true},
    Mainboard: {type: String, required: true},
    RAM: {type: String, required: true},
    CPU: {type: String, required: true},
    HardDisk: {type: String, required: true},
    Nguoidung: {type: String, required: true},
    Didong: {type: String, required: false},
    BoPhan: {type: String, required: true},
    Loai: {type: String, required: true},
    headcount: {type: String, required: true},
    noilamviec: {type: String, required: true},
    software: {type: String, required: true},
    ngaymua: {type: String, required: false},
    ngayhethan: {type: String, required: false},
    dexuat: {type: String, required: false},
    notes: {type: String, required: false},
    tinhtrang: {type: String, required: true},
    morong: {type: String, required: false},
})


module.exports = mongooge.model('thietbi', schema, 'thietbi')