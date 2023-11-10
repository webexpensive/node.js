import mongoose from "mongoose";
 
const Schema = mongoose.Schema;
// установка схемы
const filesScheme = new Schema({
    title: { type : String , unique : true, required : true, dropDups: true },
	date_add: Date
});

export default mongoose.model("Files", filesScheme);