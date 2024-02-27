// // Middleware to verify if the user is authenticated
// export const isAuthenticated = (req, res, next) => {
//     console.log("isAuthenticated");
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect('/login'); // redirect to login if the user is not authenticated
// }

// middleware to check if an user is authenticated
export const isAuthenticated = (req, res, next) => {
    // isAuthenticated() is an helper function coming from Passport
    // if (!req.isAuthenticated()) {
    //     // store in the session the path we want to redirect the user to after login
    //     req.session.returnTo = req.originalUrl;
    //     req.flash("error", "You must be signed in first");
    //     return res.redirect("/login");
    // }
    next();
}

// stores req.session.returnTo in res.locals.returnTo
export const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}