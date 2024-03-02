import axios from 'axios';

const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;

export async function registerUser(userData) {
    console.log("***** registerUser() - userData: ", userData)

    try {
        console.log("***** registerUser() - try - serverUrl: ", serverUrl)
        const res = await axios.post(serverUrl + '/register', userData);
        console.log("***** registerUser() - res: ", res)

        return res.data;

    } catch (err) {console.log(err)}

}

export async function loginUser(credentials) {
    try {
        const response = await axios.post(serverUrl + '/login', credentials);

        return response.data;
        
    } catch (err) {console.log(err)}
}

export async function logoutUser() {
    try {
        const response = await axios.post(serverUrl + '/logout', { withCredentials: true });

        return response.data;

    } catch (err) { console.log(err) }
}
