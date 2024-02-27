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

import flash from "connect-flash";

import session from "express-session";
import MongoStore from 'connect-mongo'; // use MongoDB to store sessions

import { isAuthenticated, storeReturnTo } from "./middleware/user.js";

import User from "./models/user.js";

import List from "./models/list.js";
import ListItem from "./models/listItem.js"

// DEVELOPMENT
// const localDbUrl = "mongodb://localhost:27017/todos"
// const localCbUrl = "http://localhost:5173/auth/google/callback"

const dbUrl = process.env.NODE_ENV === 'production' ? process.env.DB_URL : process.env.LOCAL_DB_URL;
// const dbUrl = process.env.NODE_ENV === 'production' ? process.env.DB_URL : localDbUrl;
// const cbUrl = process.env.NODE_ENV === 'production' ? process.env.CB_URL : localCbUrl;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

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

app.use(flash());

// Passport initialization; session should be initialized before
app.use(passport.initialize());
app.use(passport.session());
// specify the authentication strategies - defined in User model, added automatically
passport.use(new LocalStrategy(User.authenticate()));



app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));



//
// EXPRESS-SESSION
//

//
// express-session configuration
//

//
// PASSPORT
//

// Passport.js initialize
app.use(passport.initialize());
app.use(passport.session());

// Local Strategy

// configuration of local strategy for Passport.js
passport.use(new LocalStrategy(
    { usernameField: 'username' }, // be sure that username is defined as 'username'
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });

            if (!user) {
                return done(null, false, { message: 'Username not found' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return done(null, false, { message: 'Wrong password' });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));


// serialize the user for storing in the session
// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, {
            _id: user._id,
            username: user.username
        });
    });
});

// deserialize the use from the session
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// passport.deserializeUser(function (user, cb) {
//     process.nextTick(function () {
//         return cb(null, user);
//     });
// });

// use Passport.js in express.js App
// app.use(passport.initialize());
// app.use(passport.session());

// middleware for flashes and for user information
app.use((req, res, next) => {
    // req.user is provided by Passport and contains information about the current user:
    // id, username, email or undefined if the user is not logged in
    // Now in all templates I have access to currentUser
    // used in NavBar to disable login/register or logout buttons
    res.locals.currentUser = req.user;

    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// ROUTES

// protected route

// route for dashboard (main page)
app.get('/dashboard', isAuthenticated, (req, res) => {
    // send the user information to the dashboard
    // res.redirect('dashboard', { user: req.user }); 
    res.send({ user: req.user })
});

app.route("/lists")
    .get(isAuthenticated, async function (req, res) {
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
    .get(isAuthenticated, async function (req, res) {
        try {
            const allTodosList = await List.findOne({ isAllTodos: true }).exec();
            res.send(allTodosList);


        } catch (err) {
            console.log(err);
        }
    })

app.route("/lists/:id")
    .get(isAuthenticated, async function (req, res) {
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
    .get(isAuthenticated, async function (req, res) {
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
    .get(isAuthenticated, cors(), async function (req, res) {
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
app.post('/login', passport.authenticate('local', {
    failureFlash: true,
    successRedirect: '/dashboard', // redirect to dashboard if success
    failureRedirect: '/login', // redirect to login if failure
    session: true
}));


app.get('/login', (req, res) => {

    const isAuth = req.isAuthenticated();
    console.log("isAuth = ", isAuth)
//     // if the user is already authenticated, redirect to dashboard instead of login page
//     // if (req.isAuthenticated()) {
    if (isAuth) {

//         // return res.redirect('dashboard');
        console.log("USER IS ALREADY AUTHENTICATED")
    }
//     // otherwise, show login page
//     // res.redirect('/login');

//     // res.redirect('login');
    console.log("USER IS NOT AUTHENTICATED")
});


// route for registration
app.get('/register', cors(), (req, res) => {
    res.redirect('register'); // show registration page
});

// module.exports.register = async (req, res
app.post('/register', async (req, res) => {
    console.log("***** app.post(/register) - req.body: ", req.body);
    const { email, username, password } = req.body;
    // const user = new User({
    //     username,
    //     email
    // });
    const user = new User({
        username,
        email,
        password
    });
    try {
        console.log("***** app.post(/register) - try - user:", user);
        console.log("***** app.post(/register) - password:", password);
        // const registeredUser = await User.register(user, password);
        // const registeredUser = await User.save();
        User.save()
            .then(user => {
                console.log("user registered; user: ", user);
                // req.login(registeredUser, (err) => {
                //     if (err)
                //         return next(err);

                //     req.flash("success", "Welcome to Todos 2.0");
                //     res.redirect("dashboard");

                // })
                return user;
            })
            .catch(err => console.log("error in save: ", err))
        // console.log("***** app.post(/register) - registeredUser: ", registeredUser);
        // call login() method by Passport to start a login session
        // you don't have to login after register

    } catch (err) {
        req.flash("error during registration: ", err.message);
        return res.redirect("register");
    }
});

// app.post(isValidUser, '/register', async (req, res) => {
//     console.log("***** app.post('/register') - req.body: ", req.body)
//     try {
//         const { username, email, password } = req.body;

//         // checking if the user already exists
//         const existingUser = await User.findOne({ $or: [{ username: username }, { email: email }] });
//         if (existingUser) {
//             return res.status(400).json({ message: 'Username or email already registered' });
//         }

//         // creates a new user
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new User({ username: username, email: email, password: hashedPassword });
//         await newUser.save();

//         // redirect to login after registration
//         // res.redirect('/login');
//         res.redirect('login');
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Error during registration' });
//     }
// });

// route for logout
app.get('/logout', (req, res) => {
    req.logout(); // delete the user session
    res.redirect('/login'); // redirect to login page
});



// setup dir for static files
// app.use(express.static(path.join(__dirname, '/')));

// // route for all other requests
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });



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

