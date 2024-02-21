import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import 'dotenv/config'
import List from "./models/list.js";
import ListItem from "./models/listItem.js"
// import dotenv from "dotenv;"

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 200,
};


app.use(cors(corsOptions));  // Use cors middleware

// app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));



// if (process.env.NODE_ENV !== "production") {
//     dotenv.config();
// }

const dbUrl = process.env.NODE_ENV === 'production' ? process.env.DB_URL : process.env.LOCAL_DB_URL;

// ROUTES

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
                {...req.body}
            )
        } catch (err) {
            err => res.send(err);
        }
    })

app.route("/listItems/:id/date")
    .put(async function (req, res) {
    // try {
    //     const { date } = req.body;
    //     const { id } = req.params;

    //     const newDate = new DateModel({ date });
    //     await newDate.save();
    //     res.status(200).send('Data saved successfully');
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).send('Error saving data');
    // }
});

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

