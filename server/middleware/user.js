// import User from "../models/user";
// import ExpressError from "../utils/ExpressError";


// Middleware to verify if the user is authenticated
// Used to protect private routes
export const isAuthenticated = (req, res, next) => {
    console.log("isAuthenticated");
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/login'); // redirect to login if the user is not authenticated
}

export const checkLoggedIn = (req, res, next) => {
    console.log("checkLoggedIn() - req.isAuthenticated(): ", req.isAuthenticated())
    if (req.isAuthenticated()) {
        res.send({
            success: true,
            message: "User already logged in",
            user: req.user,
            //   cookies: req.cookies
        });
    }
    next();
}

// stores req.session.returnTo in res.locals.returnTo
export const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

