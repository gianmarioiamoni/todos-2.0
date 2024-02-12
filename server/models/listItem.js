import mongoose from "mongoose"
const Schema = mongoose.Schema;

const listItemSchema = new Schema({
    name: String,
    checked: Boolean,
    listId: {
        type: Schema.Types.ObjectId,
        ref: "listSchema"
    },
});

export default mongoose.model("ListItem", listItemSchema);