const _report = require('../model/report')

async function create_report(doc){
    //console.log(doc)
    try{
        await _report.create(doc)
        return true
    }catch(e){
        return false
    }
}

async function doc_report(){
    let docs = await _report.find()
    return docs
}

async function id_report(id){
    let docs = await _report.findById({_id: id})
    return docs
}

module.exports = {
    create_report,
    doc_report,
    id_report,
}