import axios from 'axios';

const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;


export async function getAllLists() {
    try {
        const orderedListsArray = await axios.get(serverUrl + '/lists', { withCredentials: false });

        return orderedListsArray.data;
    } catch (err) { console.log(err) }
}

export async function updateList(id, name) {

    try {
        const response = axios.put(serverUrl + `/lists/${id}`,
            {
                name: name
            }
        );
        return response.data;
    } catch (err) { console.log(err) }
}

export async function newList(name, icon, isAllTodos=false) {
    const newListData = {
        name: name,
        icon: icon,
        id: crypto.randomUUID(),

    };
    try {
        const payload = { name: name, icon: icon, isAllTodos: isAllTodos};
        const res = await axios.post(serverUrl + "/lists", payload);

        // id field is added to db by the server
        const returnData = { ...res.data, id: res.data._id };

        return returnData;

    } catch (err) { console.log(err) }
}

export async function deleteList(id) {
    try {
        const res = await axios.delete(serverUrl + `/lists/${id}`);
        await axios.delete(serverUrl + `/lists/${id}/listItems`);

        return res;
    } catch (err) { console.log(err) }
}

export async function getAllTodosListId() {
    try {
        const allTodosList = await axios.get(serverUrl + "/lists/allTodosList", { withCredentials: false });
        if (allTodosList.data != null) {
            return allTodosList.data.id;
        }
        else {
            return -1;
        }

    } catch (err) { console.log(err) }
}


