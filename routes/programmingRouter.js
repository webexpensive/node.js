import express from "express";
import * as programmingController from "../controllers/programmingController.js";
const programmingRouter = express.Router();
import { param } from "express-validator";
 
const urlDataValidateChainMethod = [
  param("url")
    .exists()
    .withMessage("Параметр обязателен")
	.matches('^[0-9a-zA-Z\-\_]+$')
	.withMessage("Неверные символы в url")
    .isString()
    .withMessage("Параметр должен быть строкой")
	.isLength({ min: 2 })
    .withMessage("Параметр не отвечает минимальной длине символов")
	.trim()
	.escape(),
];
 
programmingRouter.get("/", programmingController.getProgrammingList);
programmingRouter.use("/loadprogramming/", programmingController.postProgrammingLoad);
programmingRouter.get("/:url/", urlDataValidateChainMethod, programmingController.getProgramming);

export default programmingRouter;