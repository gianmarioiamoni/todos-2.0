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

import { isAuthenticated } from "./middleware/user.js";

import User from "./models/user.js";

import List from "./models/list.js";
import ListItem from "./models/listItem.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true")
    next();
});

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
};


app.use(cors(corsOptions));  // Use cors middleware

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

const dbUrl = process.env.NODE_ENV === 'production' ? process.env.DB_URL : process.env.LOCAL_DB_URL;

//
// EXPRESS-SESSION
//

//
// Configurazione express-session
//
app.use(session({
    secret: 'TODOS-2.0-MY-SECRET',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set to true if using in production) HTTPS
}));

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
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// deserialize the use from the session
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// use Passport.js in express.js App
app.use(passport.initialize());
app.use(passport.session());


// ROUTES

// protected route

// route for dashboard (main page)
app.get('/dashboard', isAuthenticated, (req, res) => {
    // send the user information to the dashboard
    res.redirect('dashboard', { user: req.user }); 
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
    .get(isAuthenticated, async function (req, res) {
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
    successRedirect: '/dashboard', // redirect to dashboard if success
    failureRedirect: '/login', // redirect to login if failure
}));

app.get('/login', (req, res) => {
    // if the user is already authenticated, redirect to dashboard instead of login page
    if (req.isAuthenticated()) {
        // return res.redirect('/dashboard');
        return res.redirect('dashboard');
    }
    // otherwise, show login page
    // res.render('login');
    // res.redirect('/login');
    res.redirect('login');
});

// route for registration
app.get('/register', (req, res) => {
    res.redirect('register'); // show registration page
});

app.post('/register', async (req, res) => {
    console.log("***** app.post('/register') - req.body: ", req.body)
    try {
        const { username, email, password } = req.body;

        // checking if the user already exists
        const existingUser = await User.findOne({ $or: [{ username: username }, { email: email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already registered' });
        }

        // creates a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username: username, email: email, password: hashedPassword });
        await newUser.save();

        // redirect to login after registration
        // res.redirect('/login');
        res.redirect('login');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error during registration' });
    }
});

// route for logout
app.get('/logout', (req, res) => {
    req.logout(); // delete the user session
    res.redirect('/login'); // redirect to login page
});



// setup dir for static files
app.use(express.static(path.join(__dirname, '/')));

// route for all other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



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

