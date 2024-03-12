import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";


import path from 'path';
import { fileURLToPath } from 'url';

import 'dotenv/config';

import cookieParser from 'cookie-parser';

// Passport.js
import passport from 'passport';
import LocalStrategy from 'passport-local';

import session from "express-session";
import MongoStore from 'connect-mongo'; // use MongoDB to store sessions

import User from "./models/user.js";

import listsRoute from "./routes/lists.js"
import listItemsRoute from "./routes/listItems.js"
import userRoute from "./routes/user.js"

import ExpressError from "./utils/ExpressError.js";


// DEVELOPMENT
// const localDbUrl = "mongodb://localhost:27017/todos"
// const localCbUrl = "http://localhost:5173/auth/google/callback"

const dbUrl = process.env.NODE_ENV === 'production' ? process.env.DB_URL : process.env.LOCAL_DB_URL;
// const cbUrl = process.env.NODE_ENV === 'production' ? process.env.CB_URL : process.env.LOCAL_CB_URL;
const cbUrl = "http://localhost:5173/dashboard"

const CLIENT_URL = "http://localhost:5173/";

const __filename = fileURLToPath(import.meta.url);

const app = express();
app.use(express.json());
app.use(cookieParser()); // read cookies (needed for auth)


// cors
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));  // Use cors middleware

// Mongo store to memorize sessions
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SECRET
    }
});

store.on("error", function (err) {
    console.log("SESSION STORE ERROR", err)
});

// session config
const sessionConfig = {
    store: store, // It uses Mongo to store session information
    name: "session", // override default session name, for security reasons
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        // security
        httpOnly: true,
        // secure: true to be added in deployment only 
        // secure: (process.env.NODE_ENV === 'production'),
        secure: false, // DEPLOYMENT ONLY
        // setup expiring date in a week for coockie
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));

// Passport initialization: on every route call
app.use(passport.initialize());
// allow Passport to use "express-session" 
app.use(passport.session());

// specify the local authentication strategy - defined in User model, added automatically
passport.use(new LocalStrategy(User.authenticate()));


// SERIALIZE USER / DESERIALIZE USER
// specify how we store a user in the session and how we remove It from the session
// methods added by password-local-mongoose
//

// Serialize the user for storing in the session
// Passport adds the authenticated user to the end of "req.session.passport" object
// This allows the authenticated user to be attached to a unique session
passport.serializeUser(function (user, cb) {
    console.log("passport.serializeUser - user = ", user)
    process.nextTick(function () {
        return cb(null, {
            id: user._id,
            username: user.username
        });
    });
});

// Deserialize the user from the session
// req.user will contain the authenticated user object for the session
//It can be used in the routes
passport.deserializeUser(function (user, cb) {
    console.log("passport.deserializeUser - user = ", user)
    process.nextTick(function () {
        return cb(null, user);
    });
});

app.set("trust proxy", 1);

app.use(bodyParser.urlencoded({ extended: true }));

//
// ROUTES
//
app.use(listsRoute);
app.use(listItemsRoute);
app.use(userRoute);

//
// ERRORS HANDLING
//
app.all("*", (req, res, next) => {
    console.log("app.all(*)")
    next(new ExpressError("Page not found", 404));
})

// error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    console.log("app.use(err) - err: ", err )
    console.log("app.use(err) - err.message: ", err.message )
    if (!err.message)
        err.message = "Something went wrong";

    res.send({
        success: false,
        message: err.message,
        user: req.user,
        redirect: "/"
    })
})


// CONNECT TO DB
main()
    .catch(err => console.log(err));

async function main() {
    try {
        await mongoose.connect(dbUrl);
        console.log("DB CONNECTION OPEN to port 27017");
    } catch (err) {
        console.log("DB CONNECTION ERROR: " + err);
    }
}

app.listen(5000, () => {
    console.log("Server started on port 5000");
});

