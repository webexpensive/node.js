import express from "express";
import * as adminController from "../controllers/adminController.js";
const adminRouter = express.Router();
import { body} from "express-validator";

const loginDataValidateChainMethod = [
  body("login")
    .exists()
    .withMessage("Логин обязателен")
    .isString()
    .withMessage("Логин должен быть строкой")
	  .isLength({ min: 5 })
    .withMessage("Логин не отвечает минимальной длине символов")
	  .matches('^[0-9a-zA-Z]+$')
	  .withMessage("Неверные символы в логине")
	  .trim()
	  .escape(),
  body("password_auth")
    .exists()
    .withMessage("Пароль обязателен")
    .isString()
    .withMessage("Пароль должен быть строкой")
    .isLength({ min: 5 })
    .withMessage("Пароль не отвечает минимальной длине символов")
	  .matches('^[0-9a-zA-Z]+$')
	  .withMessage("Неверные символы в пароле")
	  .trim()
	  .escape(),
];

const newsDataValidateChainMethod = [
  body("title_news")
    .exists()
    .withMessage("Заголовок обязателен")
    .isString()
    .withMessage("Заголовок должен быть строкой")
    .isLength({ min: 2 })
    .withMessage("Заголовок не отвечает минимальной длине символов"),
  body("url_news")
    .exists()
    .withMessage("URL обязателен")
    .isString()
    .withMessage("URL должен быть строкой")
    .isLength({ min: 2 })
    .withMessage("URL не отвечает минимальной длине символов"),
	body("description_news")
    .exists()
    .withMessage("Описание обязательно")
    .isString()
    .withMessage("Описание должно быть строкой")
    .isLength({ min: 2 })
    .withMessage("Описание не отвечает минимальной длине символов"),
	body("keys_news")
    .exists()
    .withMessage("Ключевые слова обязательны")
    .isString()
    .withMessage("Ключевые слова должны быть строкой")
    .isLength({ min: 2 })
    .withMessage("Ключевые слова не отвечают минимальной длине символов"),
  body("text_news_short")
    .exists()
    .withMessage("Краткое содержание обязательно")
    .isString()
    .withMessage("Краткое содержание должно быть строкой")
    .isLength({ min: 2 })
    .withMessage("Краткое содержание не отвечает минимальной длине символов"),
  body("text_news")
    .exists()
    .withMessage("Содержание обязательно")
    .isString()
    .withMessage("Содержание должно быть строкой")
    .isLength({ min: 2 })
    .withMessage("Содержание не отвечает минимальной длине символов"),
];

const programmingDataValidateChainMethod = [
  body("title_programming")
    .exists()
    .withMessage("Заголовок обязателен")
    .isString()
    .withMessage("Заголовок должен быть строкой")
	  .isLength({ min: 2 })
    .withMessage("Заголовок не отвечает минимальной длине символов"),
  body("url_programming")
    .exists()
    .withMessage("URL обязателен")
    .isString()
    .withMessage("URL должен быть строкой")
    .isLength({ min: 2 })
    .withMessage("URL не отвечает минимальной длине символов"),
	body("description_programming")
    .exists()
    .withMessage("Описание обязательно")
    .isString()
    .withMessage("Описание должно быть строкой")
    .isLength({ min: 2 })
    .withMessage("Описание не отвечает минимальной длине символов"),
	body("keys_programming")
    .exists()
    .withMessage("Ключевые слова обязательны")
    .isString()
    .withMessage("Ключевые слова должны быть строкой")
    .isLength({ min: 2 })
    .withMessage("Ключевые слова не отвечают минимальной длине символов"),
  body("text_programming_short")
    .exists()
    .withMessage("Краткое содержание обязательно")
    .isString()
    .withMessage("Краткое содержание должно быть строкой")
    .isLength({ min: 2 })
    .withMessage("Краткое содержание не отвечает минимальной длине символов"),
  body("text_programming")
    .exists()
    .withMessage("Содержание обязательно")
    .isString()
    .withMessage("Содержание должно быть строкой")
    .isLength({ min: 2 })
    .withMessage("Содержание не отвечает минимальной длине символов"),
];

const newsEditDataValidateChainMethod = [
  body("id_news")
    .exists()
    .withMessage("ID обязателен")
	  .matches('^[0-9a-zA-Z]+$')
	  .withMessage("Неверные символы в ID")
    .isString()
    .withMessage("ID должен быть строкой")
	  .isLength({ min: 15 })
    .withMessage("ID не отвечает минимальной длине символов"),
  body("title_news")
    .exists()
    .withMessage("Заголовок обязателен")
    .isString()
    .withMessage("Заголовок должен быть строкой")
	  .isLength({ min: 2 })
    .withMessage("Заголовок не отвечает минимальной длине символов"),
  body("url_news")
    .exists()
    .withMessage("URL обязателен")
    .isString()
    .withMessage("URL должен быть строкой")
    .isLength({ min: 2 })
    .withMessage("URL не отвечает минимальной длине символов"),
	body("description_news")
    .exists()
    .withMessage("Описание обязательно")
    .isString()
    .withMessage("Описание должно быть строкой")
    .isLength({ min: 2 })
    .withMessage("Описание не отвечает минимальной длине символов"),
	body("keys_news")
    .exists()
    .withMessage("Ключевые слова обязательны")
    .isString()
    .withMessage("Ключевые слова должны быть строкой")
    .isLength({ min: 2 })
    .withMessage("Ключевые слова не отвечают минимальной длине символов"),
  body("text_news_short")
    .exists()
    .withMessage("Краткое содержание обязательно")
    .isString()
    .withMessage("Краткое содержание должно быть строкой")
    .isLength({ min: 2 })
    .withMessage("Краткое содержание не отвечает минимальной длине символов"),
  body("text_news")
    .exists()
    .withMessage("Содержание обязательно")
    .isString()
    .withMessage("Содержание должно быть строкой")
    .isLength({ min: 2 })
    .withMessage("Содержание не отвечает минимальной длине символов"),
];

const programmingEditDataValidateChainMethod = [
  body("id_programming")
    .exists()
    .withMessage("ID обязателен")
	  .matches('^[0-9a-zA-Z]+$')
	  .withMessage("Неверные символы в ID")
    .isString()
    .withMessage("ID должен быть строкой")
	  .isLength({ min: 15 })
    .withMessage("ID не отвечает минимальной длине символов"),
  body("title_programming")
    .exists()
    .withMessage("Заголовок обязателен")
    .isString()
    .withMessage("Заголовок должен быть строкой")
	  .isLength({ min: 2 })
    .withMessage("Заголовок не отвечает минимальной длине символов"),
  body("url_programming")
    .exists()
    .withMessage("URL обязателен")
    .isString()
    .withMessage("URL должен быть строкой")
    .isLength({ min: 2 })
    .withMessage("URL не отвечает минимальной длине символов"),
	body("description_programming")
    .exists()
    .withMessage("Описание обязательно")
    .isString()
    .withMessage("Описание должно быть строкой")
    .isLength({ min: 2 })
    .withMessage("Описание не отвечает минимальной длине символов"),
	body("keys_programming")
    .exists()
    .withMessage("Ключевые слова обязательны")
    .isString()
    .withMessage("Ключевые слова должны быть строкой")
    .isLength({ min: 2 })
    .withMessage("Ключевые слова не отвечают минимальной длине символов"),
  body("text_programming_short")
    .exists()
    .withMessage("Краткое содержание обязательно")
    .isString()
    .withMessage("Краткое содержание должно быть строкой")
    .isLength({ min: 2 })
    .withMessage("Краткое содержание не отвечает минимальной длине символов"),
  body("text_programming")
    .exists()
    .withMessage("Содержание обязательно")
    .isString()
    .withMessage("Содержание должно быть строкой")
    .isLength({ min: 2 })
    .withMessage("Содержание не отвечает минимальной длине символов"),
];

const deleteNewsDataValidateChainMethod = [
  body("id_news")
    .exists()
    .withMessage("Нет обязательного параметра")
	  .matches('^[0-9a-zA-Z]+$')
	  .withMessage("Неверные символы в параметре")
    .isString()
    .withMessage("Параметр должен быть строкой")
	  .isLength({ min: 10 })
    .withMessage("Параметр не отвечает минимальной длине символов")
	  .trim()
	  .escape(),
];

const deleteProgrammingDataValidateChainMethod = [
  body("id_programming")
    .exists()
    .withMessage("Нет обязательного параметра")
	  .matches('^[0-9a-zA-Z]+$')
	  .withMessage("Неверные символы в параметре")
    .isString()
    .withMessage("Параметр должен быть строкой")
	  .isLength({ min: 10 })
    .withMessage("Параметр не отвечает минимальной длине символов")
	  .trim()
	  .escape(),
];

const mapEditDataValidateChainMethod = [
  body("id_map")
    .exists()
    .withMessage("Нет обязательного параметра")
	  .matches('^[0-9]+$')
	  .withMessage("Неверные символы в параметре")
    .isString()
    .withMessage("Параметр должен быть строкой")
	  .isLength({ min: 1 })
    .withMessage("Параметр не отвечает минимальной длине символов")
	  .trim()
	  .escape(),
];

const settingsEditDataValidateChainMethod = [
  body("title_setting")
    .exists()
    .withMessage("Заголовок обязателен")
    .isString()
    .withMessage("Заголовок должен быть строкой")
	  .isLength({ min: 2 })
    .withMessage("Заголовок не отвечает минимальной длине символов"),
	body("description_setting")
    .exists()
    .withMessage("Описание обязательно")
    .isString()
    .withMessage("Описание должно быть строкой")
    .isLength({ min: 2 })
    .withMessage("Описание не отвечает минимальной длине символов"),
	body("keys_setting")
    .exists()
    .withMessage("Ключевые слова обязательны")
    .isString()
    .withMessage("Ключевые слова должны быть строкой")
    .isLength({ min: 2 })
    .withMessage("Ключевые слова не отвечают минимальной длине символов")
];

const deleteFilesDataValidateChainMethod = [
  body("id_files")
    .exists()
    .withMessage("Нет обязательного параметра")
	  .matches('^[0-9a-zA-Z]+$')
	  .withMessage("Неверные символы в параметре")
    .isString()
    .withMessage("Параметр должен быть строкой")
	  .isLength({ min: 10 })
    .withMessage("Параметр не отвечает минимальной длине символов")
	  .trim()
	  .escape(),
];

adminRouter.use("/login/", loginDataValidateChainMethod, adminController.postLogin);
adminRouter.use("/addnews/", newsDataValidateChainMethod, adminController.postNewsAdd);
adminRouter.use("/addprogramming/", programmingDataValidateChainMethod, adminController.postProgrammingAdd);
adminRouter.use("/loadfiles/", adminController.postFilesLoad);
adminRouter.use("/deletenews/", deleteNewsDataValidateChainMethod, adminController.postNewsDelete);
adminRouter.use("/deleteprogramming/", deleteProgrammingDataValidateChainMethod, adminController.postProgrammingDelete);
adminRouter.use("/loadnews/", adminController.postNewsLoad);
adminRouter.use("/loadprogramming/", adminController.postProgrammingLoad);
adminRouter.use("/loadlogs/", adminController.postLogsLoad);
adminRouter.use("/loadsettings/", adminController.postSettingsLoad);
adminRouter.use("/news-:url/", adminController.postNewsEditLoad);
adminRouter.use("/programming-:url/", adminController.postProgrammingEditLoad);
adminRouter.use("/editnews/", newsEditDataValidateChainMethod, adminController.postNewsEdit);
adminRouter.use("/editprogramming/", programmingEditDataValidateChainMethod, adminController.postProgrammingEdit);
adminRouter.use("/upsettings/", settingsEditDataValidateChainMethod, adminController.postSettingsEdit);
adminRouter.use("/upmap/", mapEditDataValidateChainMethod, adminController.postMapEdit);
adminRouter.use("/loadfileslist/", adminController.postFilesLoadList);
adminRouter.use("/deletefiles/", deleteFilesDataValidateChainMethod, adminController.postFilesDelete);
adminRouter.use("/", adminController.getAdmin);

export default adminRouter;