import mongoose from "mongoose";
 
const Schema = mongoose.Schema;
// установка схемы
const programmingScheme = new Schema({
    title: { type : String , unique : true, required : true, dropDups: true },
	url: { type : String , unique : true, required : true, dropDups: true },
    img: String,
	description: String,
	keys: String,
	content_short: String,
	content: String,
	date_add: Date,
	visibility: {type: Number,default: 0},
});

export default mongoose.model("Programming", programmingScheme);