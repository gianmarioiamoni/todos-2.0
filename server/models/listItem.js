import mongoose from "mongoose"
const Schema = mongoose.Schema;

const listItemSchema = new Schema({
    name: String,
    checked: Boolean,
    id: String,
    listId: String
    // listId: {
    //     type: Schema.Types.ObjectId,
    //     ref: "List"
    // }
});

export default mongoose.model("ListItem", listItemSchema);