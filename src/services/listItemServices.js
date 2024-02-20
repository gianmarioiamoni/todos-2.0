import axios from "axios";
import { AllTodosListItem } from "../components/AllTodosListItem";

const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;

async function getItems(listId) {
    try {
        const res = await axios.get(serverUrl + `/lists/${listId}/listItems`);
        return res.data;

    } catch { (err) => console.log(err) }
}

export async function getAllTodosListItems() {
    function sortItems(a, b) {
        return a.priority - b.priority;
    }
    try {
        const resItems = await axios.get(serverUrl + `/listItems`);
        const resList = await axios.get(serverUrl + `/lists/allTodosList`);
        const returnData = { ...resList?.data, items: resItems?.data.sort((a, b) => sortItems(a, b)) };

        // console.log("^^^^^ getAllTodosListItems() - returnData: ", returnData)

        return returnData;

    } catch { (err) => console.log(err) }
}

export async function getListItems(listId) {
    function sortItems(a, b) {
        return a.priority - b.priority;
    }
    try {

        const resItems = await axios.get(serverUrl + `/lists/${listId}/listItems`);
        const resList = await axios.get(serverUrl + `/lists/${listId}`);
        const returnData = { ...resList?.data, items: resItems?.data.sort((a, b) => sortItems(a, b)) };

        return returnData;

    } catch { (err) => console.log(err) }
}

export async function newItem(newItemName, listId, priority=3) {
    try {
        const payload = {
            name: newItemName,
            checked: false,
            priority: priority,
            listId: listId
        };
        const res = await axios.post(serverUrl + "/listItems", payload);

        const returnData = { ...res.data, id: res.data._id };
        return returnData;

    } catch (err) { console.log(err) }
}

export async function deleteItem(id) {
    try {
        const res = await axios.delete(serverUrl + `/listItems/${id}`);
        return res.data;
    } catch { (err) => console.log(err) }
}

export async function toggleChecked(id, isChecked) {
    try {
        const response = await axios.put(serverUrl + `/listItems/${id}`,
            {
                checked: isChecked
            }
        );
        return response.data;

    } catch (err) { console.log(err) }
}

export async function updateItem(id, text) {
    try {
        const response = await axios.put(serverUrl + `/listItems/${id}`,
            {
                name: text
            }
        );
        return response.data;

    } catch (err) { console.log(err) }

}
