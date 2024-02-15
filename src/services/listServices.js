import axios from 'axios';

const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;


export async function getAllLists() {
    try {
        const data = await axios.get(serverUrl + '/lists');
        return data.data;
    } catch (err) { console.log(err) }
}

export async function updateList(id, name) {

    try {
        const oldList = await axios(serverUrl + `/lists/${id}`);
        const newList = { ...oldList.data, name: name };

        const response = axios.put(serverUrl + `/lists/${id}`,
            {
                name: name
            }
        );
        return response.data;
    } catch (err) { console.log(err) }
}

export async function newList(name, icon) {
    const newListData = {
        name: name,
        icon: icon,
        id: crypto.randomUUID(),
    };
    try {
        const payload = { name: name, icon: icon };
        const res = await axios.post(serverUrl + "/lists", payload);

        // id field is added to db by the server
        const returnData = { ...res.data, id: res.data._id };

        return returnData;

    } catch (err) { console.log(err) }
}

export async function deleteList(id) {
    try {
        // alert(`delete list id = ${id}`);

        const res = await axios.delete(serverUrl + `/lists/${id}`);
        await axios.delete(serverUrl + `/lists/${id}/listItems`);

        return res;
    } catch (err) { console.log(err) }
}


