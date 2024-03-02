import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";


import path from 'path';
import { fileURLToPath } from 'url';

import 'dotenv/config';

// Passport.js
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';

import session from "express-session";
import MongoStore from 'connect-mongo'; // use MongoDB to store sessions

import { checkLoggedIn,isAuthenticated, storeReturnTo } from "./middleware/user.js";

import User from "./models/user.js";
// import userRoute from "./routes/user.js"

import * as users from "./controllers/user.js"

import ExpressError from "./utils/ExpressError.js";
import catchAsync from "./utils/catchAsync.js";

import List from "./models/list.js";
import ListItem from "./models/listItem.js"

import passportLocalMongoose from "passport-local-mongoose";
import findOrCreate from "mongoose-findorcreate";
import { FastfoodOutlined, TrendingUp } from "@mui/icons-material";

import cookieParser from 'cookie-parser';



// DEVELOPMENT
// const localDbUrl = "mongodb://localhost:27017/todos"
// const localCbUrl = "http://localhost:5173/auth/google/callback"

const dbUrl = process.env.NODE_ENV === 'production' ? process.env.DB_URL : process.env.LOCAL_DB_URL;
// const dbUrl = process.env.NODE_ENV === 'production' ? process.env.DB_URL : localDbUrl;
// const cbUrl = process.env.NODE_ENV === 'production' ? process.env.CB_URL : localCbUrl;

// const CLIENT_URL = "http://localhost:5173/";
const CLIENT_URL = "http://localhost:5173/";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// const router = express.Router();
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
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
    // secret: process.env.SECRET,
    secret: "THISISMYSECRET",
    resave: false,
    saveUninitialized: true,
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

// app.use(cookieParser({ secret: 'mySecret' }));

// Passport initialization: on every route call
app.use(passport.initialize());
// allow Passport to use "express-session" 
app.use(passport.session());
// specify the authentication strategy - defined in User model, added automatically

passport.use(new LocalStrategy(User.authenticate()));

// passport.use(User.createStrategy());


// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// middleware for user information
app.use((req, res, next) => {
    // req.user is provided by Passport and contains information about the current user:
    // id, username, email or undefined if the user is not logged in
    // Now in all templates I have access to currentUser
    // used in NavBar to disable login/register or logout buttons
    res.locals.currentUser = req.user;
    
    // console.log("app.use((req, res, next) - req.user = ", req.user);

    next();
});

// specify how we store a user in the session and how we remove It from the session
// methods added by password-local-mongoose

passport.serializeUser(function (user, cb) {
    console.log("passport.serializeUser - user = ", user)
    process.nextTick(function () {
        return cb(null, {
            id: user._id,
            username: user.username
        });
    });
});

passport.deserializeUser(function (user, cb) {
    console.log("passport.deserializeUser - user = ", user)
    process.nextTick(function () {
        return cb(null, user);
    });
});

app.set("trust proxy", 1);



app.use(bodyParser.urlencoded({ extended: true }));

// app.use("/", userRoute);



//
// EXPRESS-SESSION
//

//
// express-session configuration
//

//
// PASSPORT
//


// Local Strategy

// configuration of local strategy for Passport.js
// passport.use(new LocalStrategy(
//     { usernameField: 'username' }, // be sure that username is defined as 'username'
//     async (username, password, done) => {
//         try {
            
//             console.log("LOCAL STRATEGY - username = ", username)
//             console.log("LOCAL STRATEGY - password = ", password)
//             const user = await User.findOne({ username: username });
//             // const user = await User.find({ username: username });
//             console.log("LOCAL STRATEGY - user = ", user)

//             if (!user) {
//                 console.log("LOCAL STRATEGY - USERNAME NOT FOUND")
//                 return done(null, false, { message: 'Username not found' });
//             }

//             const isMatch = await bcrypt.compare(password, user.password);

//             if (!isMatch) {
//                 return done(null, false, { message: 'Wrong password' });
//             }

//             return done(null, user);
//         } catch (err) {
//             return done(err);
//         }
//     }
// ));


// Serialize the user for storing in the session
// Passport adds the authenticated user to the end of "req.session.passport" object
// This allows the authenticated user to be attached to a unique session

// passport.serializeUser((user, done) => {
//     done(null, user);
// });
// passport.serializeUser(function (user, done) {
//     process.nextTick(function () {
//         return done(null, {
//             id: user.id,
//             username: user.username,
//         });
//     });
// });

// Deserialize the user from the session
// req.user will contain the authenticated user object for the session
//It can be used in the routes

// passport.deserializeUser(function (user, done) {
//         return done(null, user);
// });
// passport.deserializeUser(function (user, done) {
//     process.nextTick(function () {
//         return done(null, user);
//     });
// });


// middleware for flashes and for user information
app.use((req, res, next) => {
    // req.user is provided by Passport and contains information about the current user:
    // id, username, email or undefined if the user is not logged in
    // Now in all templates I have access to currentUser
    // used in NavBar to disable login/register or logout buttons
    res.locals.currentUser = req.user;

    next();
});

// ROUTES

// protected route

// route for dashboard (main page)
// app.get('/dashboard', isAuthenticated, (req, res) => {
//     // send the user information to the dashboard
//     // res.redirect('dashboard', { user: req.user }); 
//     res.send({ user: req.user })
// });

app.route("/lists")
    .get(async function (req, res) {
        try {
            const data = await List.find({}, null);

            // order lists by putting ALL TODOs at the top of the array
            const listsArray = [...data];
            const idx = listsArray.findIndex((l) => l.isAllTodos === true);
            if (idx === -1) {
                // no ALL TODOs lists in db
                res.send(listsArray);
            }

            // ALL TODOs is in the db; put It on the top of the array
            const allTodosList = listsArray[idx];
            const filteredListsArray = listsArray.filter((l) => l.isAllTodos !== true);
            const orderedListsArray = [allTodosList, ...filteredListsArray];

            // // res.send(data);
            res.send(orderedListsArray);
        } catch (err) {
            console.log(err);
        }

    })
    .post(async function (req, res) {
        try {
            const { name, icon } = req.body;
            const savedData = await new List({ name: name, icon: icon }).save()

            const newStrId = savedData._id.valueOf();
            const newId = savedData._id;

            const newSavedData = await List.findByIdAndUpdate(newId, { id: newStrId });

            res.send(newSavedData);
        } catch (err) {
            console.log(err);
        }

    })

app.route("/lists/allTodosList")
    // .get(isAuthenticated, async function (req, res) {
    .get(async function (req, res) {
        try {
            const allTodosList = await List.findOne({ isAllTodos: true }).exec();
            res.send(allTodosList);


        } catch (err) {
            console.log(err);
        }
    })

app.route("/lists/:id")
    .get(async function (req, res) {
        const id = req.params.id;

        try {
            const data = await List.findOne({ id: id });
            res.send(data);
        } catch (err) {
            console.log(err);
        }

    })
    .put(async function (req, res) {
        const { name } = req.body;
        const id = req.params.id;
        try {
            const response = await List.findByIdAndUpdate((id),
                {
                    name: name
                }
            )
            res.send(response);
        } catch (err) {
            res.send(err);
        }
    })
    .delete(async function (req, res) {
        const id = req.params.id;
        try {
            const data = await List.findByIdAndDelete((id));
            res.send(data);
        } catch (err) {
            res.send(err)
        }
    });


app.route("/listItems/:id")
    .delete(async function (req, res) {
        try {
            await ListItem.findByIdAndDelete((req.params.id));
            res.send("todo successfully deleted");
        } catch (err) {
            err => res.send(err)
        }
    })
    .put(async function (req, res) {
        console.log("PUT - req.body: ", req.body)
        try {
            await ListItem.findByIdAndUpdate((req.params.id),
                { ...req.body }
            )
        } catch (err) {
            err => res.send(err);
        }
    })

app.route("/listItems")
    .get(async function (req, res) {
        try {
            const data = await ListItem.find({}).exec();
            res.send(data);
        } catch (err) {
            console.log(err);
        }

    })
    .post(async function (req, res) {
        try {
            const { name, checked, priority, listId, date } = req.body;
            const savedData = await new ListItem({
                name: name,
                checked: checked,
                priority: priority,
                date: date,
                listId: listId
            }).save()

            const newStrId = savedData._id.valueOf();
            const newId = savedData._id;

            const newSavedData = await ListItem.findByIdAndUpdate(newId, { id: newStrId });

            res.send(newSavedData);
        } catch (err) {
            console.log(err);
        }

    });


app.route("/lists/:id/listItems")
    .get(async function (req, res) {
        const { id } = req.params;

        try {
            const data = await ListItem.find({ listId: id }, null);
            res.send(data);
        } catch (err) {
            res.send(err);
        }

    })
    .put(async function (req, res) {
        const { name, id, checked, listId } = req.body;
        const _id = req.params.id;
        try {
            await List.findByIdAndUpdate((_id),
                {
                    name: name,
                    checked: checked,
                    id: id,
                    listId: listId
                }
            )
            res.send("Todos successfully updated");
        } catch (err) {
            res.send(err);
        }
    })
    .delete(async function (req, res) {
        const listId = req.params.id;
        try {
            const data = await ListItem.deleteMany({ listId: listId });
            res.send(data);
        } catch (err) {
            res.send(err);
        }
    });

//
// LOGIN AND REGISTRATION
//

// Server endpoint that returns user info
app.get('/userinfo',
    // passport.authenticate('local', {
    //     session: false,
    //     failureFlash: false,
    //     failureRedirect: "/userinfo/failed"
    // }),
    (req, res) => {
        console.log("app.get(/userinfo) - req.user: ", req.user)
        console.log("app.get(/userinfo) - req.isAuthenticated(): ", req.isAuthenticated())
        console.log("app.get(/userinfo) - req.session.passport: ", req.session.passport)
        console.log("app.get(/userinfo) - req.session: ", req.session)
        console.log("app.get(/userinfo) - req.session.cookie: ", req.session.cookie)
        // if (req.session.cookie != null) {
        if (req.user != null) {
            res.send({
                success: true,
                message: "User already authenticated",
                user: req.user
                // user: true 
            }
            );
        } else {
            res.send({
                success: false,
                message: "User not authenticated",
                user: null
            }
            );
        }
    }
)

app.get("/userinfo/failed", (req, res) => {
    console.log("app.get(/userinfo/failed)")
    res.send({
            success: false,
            message: "User not authenticated",
            user: req.user
        }
    );
})

app.get("/login/success", (req, res) => {
    
    console.log("app.get(/login/success) - req.user = ", req.user)
    // passport.authenticate('local', {
    //     session: false,
    //     failureFlash: false,
    //     failureRedirect: "/login"
    // })

})
    
    // if (req.user) {
    //     res.send({
    //         success: true,
    //         message: "successfull",
    //         user: "gianma",
    //         //   cookies: req.cookies
    //     });
    // } else {
    //     res.send(null);
    // }
// });

// router.get("/login/failed", (req, res) => {
app.get("/login/failed", (req, res) => {
    console.log("LOGIN FAILURE");
    // res.send(false);
    res.send({
        success: false,
        message: "Login failure"
    })
});

app.route("/register")
    // route to serve the registration form
    .get(users.renderRegister)
    // route for the POST request
    .post(catchAsync(users.register));

app.route("/login")
    // .get((req, res) => {
    //     res.send({
    //         success: true,
    //         message: "Logout successfull",
    //         user: null
    //     })
    // })
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
// app.get("/logout", users.logout);
// app.post("/logout", users.logout);

// app.post('/logout', function (req, res) {
//     req.logout(function (err) {
//         if (err) { send(err); }
//         // res.redirect('/login/failed');
//         res.send({
//             success: true,
//             message: "Logout successfull",
//             user: null
//         })
//     });
// });

app.post('/logout', (req, res, next) => {
    // req.logout(req.user, (err) => {
    //     if (err) return next(err);
    // })
    // // res.clearCookie('session');
    // // res.send({ isAuth: req.isAuthenticated(), user: req.user })
    // res.send({ success: true, message: "Logout successfull", user: null })
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        // req.flash('success', 'Goodbye!');
        res.redirect('/userinfo');
    });
})

app.get('/logoutsuccess', (req, res) => {
    console.log("app.get(/) - req.user = ", req.user);
    res.send({
        success: false,
        message: "LOGOUT",
        user: null,
        logout: true
    })
})

// app.post('/logout', async function (req, res, next) {
//     req.logout(function (err) {
//         if (err) { return next(err); }
//         res.redirect('/login/failed');
//         // res.redirect("/login")
//     });
// });

// app.post("/logout", function (req, res, next) {
//     console.log("logging out, user:" + req.user);
//     req.logout((err) => {
//         console.log("inside logout");
//         if (err) {
//             console.log("error: " + err);
//             return next(err);
//         } else {
//             console.log("destorying session in logout");
//             req.session.destroy(function (err) {
//                 if (err) {
//                     console.log("error: " + err);
//                     return next(err);
//                 } else {
//                     res.clearCookie('session');
//                     res.send({success: true, message: "Logged out successfully", user: null });
//                 }
//             });
//         }
//     });
// });

// // change password
// router.route("/changePassword")
//     // route to serve the change password form
//     .get(isLocalUser, users.renderChangePassword)
//     // route for POST request
//     // changePassword() is provided by password-local-mongoose
//     .post(isValidUser, isLocalUser, catchAsync(users.changePassword));


// app.get('/logout', (req, res) => {
//     req.logout(); // delete the user session
//     res.redirect('/login'); // redirect to login page
// });

app.all("*", (req, res, next) => {
    console.log("app.all(*)")
    next(new ExpressError("Page not found", 404));
})

// error handler
// app.use((err, req, res, next) => {
//     const { statusCode = 500 } = err;
//     console.log("app.use(err) - err: ", err )
//     console.log("app.use(err) - err.message: ", err.message )
//     if (!err.message)
//         err.message = "Something went wrong";

//     // res.status(statusCode).render("error", { err });
//     res.send({
//         success: false,
//         message: err.message 
//     })
// })


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

