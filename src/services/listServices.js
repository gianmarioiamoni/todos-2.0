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
        let oldList = await fetch(serverUrl + `/lists/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": 'application/json'
            }
        });
        oldList = await oldList.json();
        const newList = { ...oldList[0], name: name };

        const res = await fetch(serverUrl + `/lists/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(newList)
        })
        const response = res.json();
        return response;
    } catch (err) { console.log(err) }
}

export async function newList(name, icon) {
    const newListData = {
        name: name,
        icon: icon,
        id: crypto.randomUUID(),
    };
    try {
        // let res = await fetch(serverUrl + '/lists', {
        //     method: 'POST',
        //     headers: {
        //         "Content-Type": 'application/json'
        //     },
        //     body: JSON.stringify(newListData)
        // });

        const payload = { name: name, icon: icon };
        const res = await axios.post(serverUrl + "/lists", payload);

        // const response = await res.json();

        // id field is added to db by the server
        const returnData = { ...res.data, id: res.data._id };

        return returnData;

    } catch (err) { console.log(err) }
}


