import express from "express";
const router = express.Router();

import catchAsync from "../utils/catchAsync.js";

import * as lists from "../controllers/lists.js" 

router.route("/lists")
    .get(catchAsync(lists.getLists))
    .post(catchAsync(lists.addList))

router.route("/lists/allTodosList")
    .get(catchAsync(lists.getAllTodosList))
        

router.route("/lists/:id")
    .get(catchAsync(lists.getListById))
    .put(catchAsync(lists.updateListById))
    .delete(catchAsync(lists.deleteList))

router.route("/lists/:id/listItems")
    .get(catchAsync(lists.getListItems))
    .put(catchAsync(lists.updateListItems))
    .delete(catchAsync(lists.deleteListItems))
        

export default router;

