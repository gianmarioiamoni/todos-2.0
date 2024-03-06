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

async function logoutUser(id) {
    console.log("----- logoutUser() - id = ", id)
    try {
        const response = await axios.post(serverUrl + '/logout', { withCredentials: true });
        console.log("----- logoutUser() - response = ", response)
        const resetUserRes = await axios.post(serverUrl + '/resetUser', { id: id });
        console.log("----- logoutUser() - resetUserRes = ", resetUserRes)

        return response.data;

    } catch (err) { console.log(err) }
}

export const logout = async (user, setUser) => {
    try {
        console.log("Dashboard() - logout() - user: ", user)
        let response;
        if (user._id != null) {
            response = await logoutUser(user._id);
        } else {
            response = await logoutUser(user.id);
        }
        console.log("Dashboard() - handleLogout() - response: ", response)
        setUser(response.user);
        return response;
        // navigate(response.navigate);
    } catch (error) {
        console.error('Error during logout:', error);
    }
};

export async function getUserInfo() {
    console.log("----- getUserInfo()")
    try {
        const response = await axios.get(serverUrl + '/currentUser', { withCredentials: true });

        return response.data;

    } catch (err) { console.log(err) }
}
