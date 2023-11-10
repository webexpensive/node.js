import express from "express";
import fileUpload from 'express-fileupload';
import expressValidator from 'express-validator';
import http from "http";

const app = express();
const server = http.Server(app);

import hbs from "hbs";
import expressHbs from "express-handlebars";
import mongoose from "mongoose";
import { Server } from 'socket.io';
global.io = new Server(server);

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';

import redis from 'ioredis';

import session from 'express-session';

import RedisStore from 'connect-redis';

const redisClient = redis.createClient({host:'',port:'',username:'',password:''});

let store = new RedisStore({
		host: '',
		port: '',
		username:'',
		password:'',
		client: redisClient,
		ttl: 3600000
	});

import * as uuid from 'uuid';

import homeRouter from "./routes/homeRouter.js";
import adminRouter from "./routes/adminRouter.js";
import newsRouter from "./routes/newsRouter.js";
import programmingRouter from "./routes/programmingRouter.js";
import servicesRouter from "./routes/servicesRouter.js";

import path from 'path';

app.engine("hbs", expressHbs.engine(
    {
        layoutsDir: "views/layouts", 
        defaultLayout: "layout",
        extname: "hbs"
    }
));
app.set("view engine", "hbs");
hbs.registerPartials("./views/partials");

app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({ extended: true, limit: '100mb', parameterLimit:100000 }));

app.use(cookieParser());

app.use(
	session({
		store: store,
		name:'SessionCookie',
		secret: '1b9d6b1cd-bbfd-4b2d3-9b5d-ab8dfbbd4bed',
		genid: function(req) { return uuid.v4(); },
		resave: true,
		saveUninitialized: true,
		cookie: { secure: false,expires:3600000 * 720 }
	})
);

app.use(fileUpload({}));

app.use("/administrative/", adminRouter);
app.use("/news/", newsRouter);
app.use("/programming/", programmingRouter);
app.use("/services/", servicesRouter);
app.use("/", homeRouter);

app.use('/robots.txt', function (req, res, next) {
	
	let fullUrl = 'https://' + req.get('host') + '/';
	
	res.type('text/plain');
	res.send("User-agent: *\nHost: "+fullUrl+"\nSitemap: "+fullUrl+"static/map/sitemap.xml");
});

app.use("/static",express.static('./public'));

app.use(function (req, res, next) {
    res.status(404).render("404.hbs", {
							title: 'Ошибка 404',
							description: 'Запрошенная страница не существует',
							keywords: 'ошибка, 404, страница, отсутствует'
						});
});

mongoose.connect("mongodb://", { useUnifiedTopology: true, useNewUrlParser: true });

global.clients = 0;

global.io.on('connection', (socket) => {
	
  //console.log('Client with id '+socket.id+' connected');
  
  global.clients = socket.id;

  //socket.emit('message', "I'm server");

  socket.on('message', (message) =>
    console.log('Message: ', message)
  );

  socket.on('disconnect', () => {
    //console.log('Client with id '+socket.id+' disconnected');
  });
  
});

server.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});