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
        // storeReturnTo,
        passport.authenticate("local",
            {
                failureFlash: false,
                failureRedirect: "/login/failed",
                session: true,
            }),
        catchAsync(users.login)
);

router.get("/login/success", (req, res) => {
    console.log("--- get(/login/success)")
    if (req.user != null) {
        res.status(200).json({
            success: true,
            message: "Login successfull",
            user: req.user,
            redirect: "/dashboard"
        });
        // res.send({
        //     success: true,
        //     message: "Login successfull",
        //     user: req.user,
        //     redirect: "/dashboard"
        // });
    } else {
        redirect("/login/failed")
    }
});

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "Login failure",
        user: null,
        redirect: "/login"
    });
    // res.send({
    //     success: false,
    //     message: "Login failure",
    //     user: null,
    //     redirect: "/login"
    // });
    
});

// logout
router.post("/logout", users.logout); 

// // change password
// router.route("/changePassword")
//     // route to serve the change password form
//     .get(isLocalUser, users.renderChangePassword)
//     // route for POST request
//     // changePassword() is provided by password-local-mongoose
//     .post(isValidUser, isLocalUser, catchAsync(users.changePassword));
    

export default router;
