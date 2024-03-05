import List from "../models/list.js";

export async function getLists(req, res) {
    const data = await List.find({}, null);

    // order lists by putting ALL TODOs at the top of the array
    const listsArray = [...data];
    const idx = listsArray.findIndex((l) => l.isAllTodos === true);
    if (idx === -1) {
        // no ALL TODOs lists in db
        res.send(listsArray);
    }

    // ALL TODOs is in the db; put It on the top of the array
    const allTodosList = listsArray[idx];
    const filteredListsArray = listsArray.filter((l) => l.isAllTodos !== true);
    const orderedListsArray = [allTodosList, ...filteredListsArray];

    res.send(orderedListsArray);
}

export async function addList(req, res) {
    const { name, icon } = req.body;
    const savedData = await new List({ name: name, icon: icon }).save()

    const newStrId = savedData._id.valueOf();
    const newId = savedData._id;

    const newSavedData = await List.findByIdAndUpdate(newId, { id: newStrId });

    res.send(newSavedData);
}

export async function getAllTodosList(req, res) {
    const allTodosList = await List.findOne({ isAllTodos: true }).exec();
    res.send(allTodosList);
}

export async function getListById(req, res) {
    const id = req.params.id;

    const data = await List.findOne({ id: id });
    res.send(data);
}

export async function updateListById(req, res) {
    const { name } = req.body;
    const id = req.params.id;
    const response = await List.findByIdAndUpdate((id),
        {
            name: name
        }
    )
    res.send(response);
}

export async function deleteList(req, res) {
    const id = req.params.id;
    const data = await List.findByIdAndDelete((id));
    res.send(data);
}

export async function getListItems(req, res) {
    const { id } = req.params;
    const data = await ListItem.find({ listId: id }, null);
    res.send(data);
}

export async function updateListItems(req, res) {
    const { name, id, checked, listId } = req.body;
    const _id = req.params.id;
    await List.findByIdAndUpdate((_id),
        {
            name: name,
            checked: checked,
            id: id,
            listId: listId
        }
    )
    res.send("Todos successfully updated");
}

export async function deleteListItems(req, res) {
    const listId = req.params.id;
    const data = await ListItem.deleteMany({ listId: listId });
    res.send(data);
}