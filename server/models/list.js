import mongoose from "mongoose"
const Schema = mongoose.Schema;

const listSchema = new Schema({
    name: String,
    icon: String
});

export default mongoose.model("List", listSchema);