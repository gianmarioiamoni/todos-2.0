import mongoose from "mongoose"
const Schema = mongoose.Schema;

const listItemSchema = new Schema({
    id: Number,
    name: String,
    checked: Boolean,
    listId: {
        type: Schema.Types.ObjectId,
        ref: "listSchema"
    },
});

module.exports = mongoose.model("ListItem", listItemSchema);