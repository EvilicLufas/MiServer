var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.createConnection('localhost', 'smallmimall');

db.on('error', function() { console.log("error") });
db.once('open', function() {
    console.log("database connect");
    //1. Schema
    cSchema = new Schema({
        name: String,
        city: Array
    });
    cModel = db.model('City', cSchema);
    for (var index = 0; index < provinces.length; index++) {
        var element = provinces[index];
        var cEntity = new cModel(element);
        //保存到数据库
        cEntity.save();
        console.log(element.city[0].area + ":save");
    }
});