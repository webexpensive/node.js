const mongoose = require("mongoose");
 
const Schema = mongoose.Schema;
// установка схемы
const settingsScheme = new Schema({
    title: { type : String , unique : true, required : true, dropDups: true },
    img: String,
	description: String,
	keys: String
});
module.exports = mongoose.model("Settings", settingsScheme);