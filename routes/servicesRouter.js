import express from "express";
import * as servicesController from "../controllers/servicesController.js";
const servicesRouter = express.Router();
import { param } from "express-validator";
 
servicesRouter.get("/", servicesController.getServicesList);
servicesRouter.get("/lendingi/", servicesController.getServicesFull1);
servicesRouter.get("/lichnye-kabinety/", servicesController.getServicesFull2);
servicesRouter.get("/korporativnye-sajty/", servicesController.getServicesFull3);

export default servicesRouter;