import express from "express";
import * as homeController from "../controllers/homeController.js";
const homeRouter = express.Router();
 
homeRouter.get("/", homeController.index);
 
export default homeRouter;