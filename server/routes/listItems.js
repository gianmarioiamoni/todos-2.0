import express from "express";

import { isLoggedIn } from "../middleware/user.js";

import catchAsync from "../utils/catchAsync.js";

import * as listItems from "../controllers/listItems.js" 

const router = express.Router();

router.route("/listItems/:id")
    .delete(catchAsync(listItems.deleteListItem))
    .put(catchAsync(listItems.updateListItem))
        
router.route("/listItems")
    .get(catchAsync(listItems.getListItems))
    .post(catchAsync(listItems.addListItem))
        

export default router;