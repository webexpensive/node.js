const express = require("express"),
	newsController = require("../controllers/newsController.js"),
	newsRouter = express.Router(),
	{ param } = require("express-validator");
 
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
 
newsRouter.get("/", newsController.getNewsList);
newsRouter.use("/loadnews/", newsController.postNewsLoad);
newsRouter.get("/:url/", urlDataValidateChainMethod, newsController.getNews);
 
module.exports = newsRouter;