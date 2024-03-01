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

// middleware to check if an user is authenticated
export const isLoggedIn = (req, res, next) => {
    console.log("isLoggedIn() - req.isAuthenticated(): ", req.isAuthenticated())
    // isAuthenticated() is an helper function coming from Passport
    if (!req.isAuthenticated()) {
        // store in the session the path we want to redirect the user to after login
        req.session.returnTo = req.originalUrl;
        // req.flash("error", "You must be signed in first");
        // return res.redirect("/login");
        res.send({
            success: false,
            message: "You must be signed in first"
        })
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

