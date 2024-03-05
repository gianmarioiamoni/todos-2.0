import express from "express";
const router = express.Router();

import catchAsync from "../utils/catchAsync.js";
import passport from "passport";

import * as listItems from "../controllers/listItems.js" 


router.route("/listItems/:id")
    .delete(catchAsync(listItems.deleteListItem))
    .put(catchAsync(listItems.updateListItem))
        
router.route("/listItems")
    .get(catchAsync(listItems.getListItems))
    .post(catchAsync(listItems.addListItem))
        

export default router;