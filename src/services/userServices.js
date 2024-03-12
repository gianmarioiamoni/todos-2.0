import axios from 'axios';

const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;

export async function registerUser(userData) {

    try {
        const res = await axios.post(serverUrl + '/register', userData, { withCredentials: true });

        return res.data;

    } catch (err) {console.log(err)}

}

export async function loginUser(credentials) {
    try {
        const response = await axios.post(serverUrl + '/login', credentials, );

        return response.data;
        
    } catch (err) {console.log(err)}
}

async function logout(id) {
    try {
        const response = await axios.post(serverUrl + '/logout', { withCredentials: true });
        // await axios.post(serverUrl + '/resetUser', { id: id });

        // console.log("userServices.js - logout() - id: ", id)

        return response.data;

    } catch (err) { console.log(err) }
}

export const logoutUser = async (user) => {
    console.log("userServices.js - logoutUser() - user: ", user)
    try {
        const response = await axios.post(serverUrl + '/logout', { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error during logout:', error);
    }
};

export async function getUserInfo() {
    try {
        const response = await axios.get(serverUrl + '/currentUser', { withCredentials: true });

        return response.data;
    } catch (err) { console.log(err) }
}
