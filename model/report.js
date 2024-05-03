const mongooge = require("mongoose")
const Schema = mongooge.Schema
const schema = new Schema({
    motacongviec: {type: String, required: false},
    ketquacongviec: {type: String, required: false},
    motacongviectieptheo: {type: String, required: false},
    ketquacongviectieptheo: {type: String, required: false},
    name: {type: String, required: false},
    phone: {type: String, required: false},
    email: {type: String, required: false},
    rpdate: {type: String, required: false},
    toname: {type: String, required: false},
    company: {type: String, required: false},
    addcom: {type: String, required: false},
    sowork: {type: String, required: false},
    tenkysu: {type: String, required: false},
    time: {type: String, required: false},
    motatangca: {type: String, required: false},
    otstartend: {type: String, required: false},

})


module.exports = mongooge.model('report', schema, 'report')