import List from "../models/list.js";
import ListItem from "../models/listItem.js";


export async function getLists(req, res) {

    const { userId } = req.query;
    console.log("lists.js - getLists() - req.query: ", req.query)

    try {

        // const data = await List.find({ $or: [{ userId: userId }, {isAllTodos: true }] }, null);
        const data = await List.find({ userId: userId }, null).exec();

        // order lists by putting ALL TODOs at the top of the array
        let listsArray = [...data];
        console.log("lists.js - getLists() - listsArray: ", listsArray)
        console.log("lists.js - getLists() - data: ", data)
        let idx = listsArray.findIndex((l) => l.isAllTodos === true);
        if (idx === -1) {
            console.log("idx === -1")
            // no ALL TODOs lists in db
            // creates It
            const savedData = await new List(
                {
                    name: "ALL TODOs",
                    icon: "List",
                    isAllTodos: true,
                    userId: userId,
                }
            ).save();
            console.log("getLists() - savedData: ", savedData)

            const newStrId = savedData._id.valueOf();
            const newId = savedData._id;
            console.log("getLists() - newStrId: ", newStrId)
            console.log("getLists() - newId: ", newId)

            const newSavedData = await List.findByIdAndUpdate(newId, { id: newStrId });

            console.log("getLists() - newSavedData: ", newSavedData)

            listsArray = [newSavedData, ...listsArray]
            console.log("getLists() - listsArray: ", listsArray)
            if (listsArray.length === 1) {
                console.log("getLists() - listsArray.length === 1 ")
                return res.send([])
            }
            idx = 0;
            return res.send(listsArray);

        }

        // ALL TODOs is in the db; put It on the top of the array
        const allTodosList = listsArray[idx];
        const filteredListsArray = listsArray.filter((l) => l.isAllTodos !== true);
        const orderedListsArray = [allTodosList, ...filteredListsArray];

        console.log("lists.js - getLists() - orderedListsArray: ", orderedListsArray)
        res.send(orderedListsArray);
    } catch (err) { console.log(err) }
}

export async function addList(req, res) {
    const { name, icon, userId } = req.body;
    const savedData = await new List({ name: name, icon: icon, userId: userId }).save()

    const newStrId = savedData._id.valueOf();
    const newId = savedData._id;

    const newSavedData = await List.findByIdAndUpdate(newId, { id: newStrId }); 

    res.send(newSavedData);
}

export async function getAllTodosList(req, res) {
    const { userId } = req.query;
    console.log("lists.js - getAllTodosList() - userId: ", userId)
    const allTodosList = await List.findOne({ $and: [{ userId: userId }, { isAllTodos: true }] }).exec();
    console.log("lists.js - getAllTodosList() - allTodosList: ", allTodosList)
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