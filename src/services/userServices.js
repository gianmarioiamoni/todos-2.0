import axios from 'axios';

const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;

export async function registerUser(userData) {

    try {
        const res = await axios.post(serverUrl + '/register', userData);

        return res.data;

    } catch (err) {console.log(err)}

}
