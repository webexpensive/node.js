const mongoose = require("mongoose");
 
const Schema = mongoose.Schema;
// установка схемы
const adminsScheme = new Schema({
    login: { type : String , unique : true, required : true, dropDups: true },
    password: String,
	code_auth: String,
	date_auth: Date
});
module.exports = mongoose.model("Admins", adminsScheme);