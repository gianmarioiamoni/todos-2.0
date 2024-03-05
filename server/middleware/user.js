// import User from "../models/user";
// import ExpressError from "../utils/ExpressError";


// middleware to check if an user is already logged-in
// user to avoid to authenticate again
export const checkLoggedIn = (req, res, next) => {
    console.log("checkLoggedIn() - req.isAuthenticated(): ", req.isAuthenticated())
    if (req.isAuthenticated()) {
        res.send({
            success: true,
            message: "User already logged in",
            user: req.user,
            redirect: "/dashboard"
        });
    }
    next();
}


// middleware to check if an user is authenticated
// used to protect private routes
export const isLoggedIn = (req, res, next) => {
    // isAuthenticated() is an helper function coming from Passport
    if (!req.isAuthenticated()) {
        res.send({
            success: false,
            message: "You must be signed in first",
            user: null,
            redirect: "/login"
        })
    }
    next();
}


