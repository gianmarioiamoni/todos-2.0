import axios from "axios";
import { AllTodosListItem } from "../components/AllTodosListItem";

const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;

async function getItems(listId) {
    try {
        const res = await axios.get(serverUrl + `/lists/${listId}/listItems`);
        return res.data;

    } catch{(err) => console.log(err)}
}

export async function getListItems(listId, allTodosListId) {
    try {
        
        let resItems;
        // console.log("1. listId = ", listId)
        // console.log("2. allTodosListId = ", allTodosListId)
        // const resList = await axios.get(serverUrl + `/lists/${listId}`);
        // console.log("3. resList = ", resList)
        // let resItems;
        // // if list is "ALL TODOs" get all items
        // if (listId === allTodosListId) {
        //     console.log("getListItems() - ALL TODOs")
        //     resItems = await axios.get(serverUrl + `/listItems`);
        //     console.log("4a. resItems = ", resItems)
        // } else {
        //     console.log("getListItems() - NOT ALL TODOs")
        //     resItems = await axios.get(serverUrl + `/lists/${listId}/listItems`);
        //     console.log("4.b resItems = ", resItems)
        // }
        console.log("§§§§§ getListItems() - listId: ", listId);
        console.log("§§§§§ getListItems() - allTodosListId: ", allTodosListId);
        if (listId === allTodosListId) {
            console.log("§§§§§ getListItems() - ALL TODOs")
            resItems = await axios.get(serverUrl + `/listItems`);
            console.log("§§§§§ getListItems() - ALL TODOs - resItems.data = ", resItems.data)

        } else {
            console.log("§§§§§ getListItems() - NOT ALL TODOs")
            resItems = await axios.get(serverUrl + `/lists/${listId}/listItems`);
            console.log("§§§§§ getListItems() - NOT ALL TODOs - resItems.data = ", resItems.data)
        }
        console.log("§§§§§ getListItems() - resItems.data: ", resItems.data);

        const resList = await axios.get(serverUrl + `/lists/${listId}`);
        console.log("§§§§§ getListItems() - resList.data: ", resList.data);

        const returnData = { ...resList?.data, items: resItems?.data };
        console.log("§§§§§ getListItems() - returnData: ", returnData);
        return returnData;

    } catch{(err) => console.log(err)}
}

export async function newItem(newItemName, listId) {
    try {
        const payload = { name: newItemName, checked: false, listId: listId };
        const res = await axios.post(serverUrl + "/listitems", payload);

        const returnData = { ...res.data, id: res.data._id };
        return returnData;

    } catch(err) {console.log(err)}
}

export async function deleteItem(id) {
    try {
        // const res = fetch(serverUrl + `/listItems/${id}`, {
        //     method: 'DELETE'
        // });
        // const response = await res.json();
        // return response;
        const res = await axios.delete(serverUrl + `/listitems/${id}`);
        return res.data;
    } catch{(err) => console.log(err)}
}

export async function toggleChecked(id, isChecked) {
    try {
        const response = await axios.put(serverUrl + `/listitems/${id}`,
            {
                checked: isChecked
            }
        );
        return response.data;

    } catch (err) { console.log(err) }
}
        
export async function updateItem(id, text) {
    try {
        const response = await axios.put(serverUrl + `/listitems/${id}`,
            {
                name: text 
            }
        );
        return response.data;

    } catch (err) { console.log(err) }

}
