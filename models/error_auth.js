import mongoose from "mongoose";
 
const Schema = mongoose.Schema;
// установка схемы
const erAuthScheme = new Schema({
    ip: { type : String , unique : true, required : true, dropDups: true },
	count_at: {type: Number,default: 0},
    expire_at: {type: Date, default: Date.now, expires: 3600}
});

export default mongoose.model("erAuth", erAuthScheme);