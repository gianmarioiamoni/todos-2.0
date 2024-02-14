import mongoose from "mongoose"
const Schema = mongoose.Schema;

const listSchema = new Schema({
    name: String,
    icon: String,
    id: String
});

export default mongoose.model("List", listSchema);