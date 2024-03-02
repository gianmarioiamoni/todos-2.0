import express from "express";
// const router = express.Router();
const app = express();

import catchAsync from "../utils/catchAsync.js";
import passport from "passport";

// middleware function to retrieve the stored returnTo path
import { storeReturnTo } from "../middleware/user.js"

// import { renderRegister, renderLogin, login, register, logout } from "../controllers/user.js" 
import * as users from "../controllers/user.js" 

app.route("/register")
    // route to serve the registration form
    // .get(users.renderRegister)
    // route for the POST request
    .post(catchAsync(users.register));

app.route("/login")
    // route to serve the login form
    // .get(users.renderLogin)
    // route for the POST request
    // storeReturnTo stores the returnTo path from session
    // passport.authenticate() is a middleware provided by Passport
    // It uses the "local" strategy and accepts some options
    .post(storeReturnTo,
        passport.authenticate("local",
            {
                failureFlash: false,
                failureRedirect: "/login/failed",
                session: true,
            }),
        catchAsync(users.login)
    );

// logout
app.get("/logout", users.logout); 

// // change password
// router.route("/changePassword")
//     // route to serve the change password form
//     .get(isLocalUser, users.renderChangePassword)
//     // route for POST request
//     // changePassword() is provided by password-local-mongoose
//     .post(isValidUser, isLocalUser, catchAsync(users.changePassword));
    


// export default app;
