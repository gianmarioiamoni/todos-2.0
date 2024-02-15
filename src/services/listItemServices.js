import axios from "axios";

const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;

async function getItems(listId) {
    try {
        const res = await axios.get(serverUrl + `/lists/${listId}/listItems`);
        return res.data;

    } catch{(err) => console.log(err)}
}

export async function getListItems(listId) {
    try {
        const res = await axios.get(serverUrl + `/lists/${listId}`);
        const resItems = await axios.get(serverUrl + `/lists/${listId}/listItems`);
        const returnData = { ...res?.data, items: resItems.data };
        return returnData;

    } catch{(err) => console.log(err)}
}

// export async function deleteListItems(listId) {
//     try {
//         const returnData = await axios.delete(serverUrl + `/lists/${listId}/listItems`);
//         return returnData;

//     } catch { (err) => console.log(err) }
// }

export async function newItem(newItemName, listId) {
        const newItemData = {
            name: newItemName,
            checked: false,
            id: crypto.randomUUID(),
            listId: listId
        };
    try {
        const res = await fetch(serverUrl + '/listItems', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(newItemData)
        });
        const response = await res.json();
        returnData = { ...response[0], id: response[0]._id }
        return returnData;

    } catch(err) {console.log(err)}
}

export async function deleteItem(id) {
    try {
        const res = fetch(serverUrl + `/listItems/${id}`, {
            method: 'DELETE'
        });
        const response = await res.json();
        return response;
    } catch{(err) => console.log(err)}
}

export async function toggleChecked(id) {
    try {
        const oldListItem = await fetch(serverUrl + `/listItems/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": 'application/json'
            }
        });
        const oldList = await oldListItem.json();
        const newListItem = { ...oldList[0], checked: !oldList[0].checked };

        const res = await fetch(serverUrl + `/listItems/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(newListItem)
        })
        const response = await res.json();
        return response;

    } catch (err) { console.log(err) }
}
        
export async function updateItem(id, text) {
    try {
        const oldListItem = await fetch(serverUrl + `/listItems/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": 'application/json'
            }
        });
        const oldList = await oldListItem.json();
        const newListItem = { ...oldList[0], name: text };

        const res = await fetch(serverUrl + `/listItems/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(newListItem)
        })
        const response = res.json();
        return response;

    } catch (err) { console.log(err) }

}
