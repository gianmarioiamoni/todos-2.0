import express from "express";
const router = express.Router();

import * as users from "../controllers/user.js"

import catchAsync from "../utils/catchAsync.js";
import passport from "passport";


router.route("/register")
    // route to serve the registration form
    // .get(users.renderRegister)
    // route for the POST request
    .post(catchAsync(users.register));

router.route("/login")
    // route for the POST request
    // storeReturnTo stores the returnTo path from session
    // passport.authenticate() is a middleware provided by Passport
    // It uses the "local" strategy and accepts some options
    .post(
        passport.authenticate("local",
            {
                failureFlash: false,
                failureRedirect: "/login/failed",
                session: true,
            }),
        catchAsync(users.login)
);

router.get("/login/success", catchAsync(users.loginSuccess))

// router.get("/currentUser", catchAsync(users.getCurrentUser))
    
router.get("/login/failed", (req, res) => {
    console.log("router.get(/login/failed)")
    res.send({
        success: false,
        message: "Login failure",
        user: null,
        redirect: "/login"
    });
    
});

// logout
router.post("/logout", catchAsync(users.logout)); 

router.post("/resetUser", catchAsync(users.resetUser));


// // change password
// router.route("/changePassword")
//     // route to serve the change password form
//     .get(isLocalUser, users.renderChangePassword)
//     // route for POST request
//     // changePassword() is provided by password-local-mongoose
//     .post(isValidUser, isLocalUser, catchAsync(users.changePassword));
    

export default router;
