import mongoose from "mongoose";
 
const Schema = mongoose.Schema;
// установка схемы
const logsScheme = new Schema({
    ip: String,
    login: String,
	status_attempt: {
        type: Number,
        default: 0
    },
	date_ch: Date
});

export default mongoose.model("Logs", logsScheme);