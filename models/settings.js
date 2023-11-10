import mongoose from "mongoose";
 
const Schema = mongoose.Schema;
// установка схемы
const settingsScheme = new Schema({
    title: { type : String , unique : true, required : true, dropDups: true },
    img: String,
	description: String,
	keys: String
});

export default mongoose.model("Settings", settingsScheme);