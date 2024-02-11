import mongoose from "mongoose"
const Schema = mongoose.Schema;

const listSchema = new Schema({
    id: Number,
    name: String,
    icon: String
});

module.exports = mongoose.model("List", listSchema);