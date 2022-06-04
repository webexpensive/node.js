const mongoose = require("mongoose");
 
const Schema = mongoose.Schema;
// установка схемы
const logsScheme = new Schema({
    ip: String,
    login: String,
	status_attempt: {
        type: String,
        default: 0
    },
	date_ch: Date
});
module.exports = mongoose.model("Logs", logsScheme);