const express = require("express"),
	fileUpload = require('express-fileupload'),
	expressValidator = require('express-validator'),
	app = express(),
	hbs = require("hbs"),
	expressHbs = require("express-handlebars"),
	mongoose = require("mongoose");

let bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	crypto = require('crypto');

const redis = require('ioredis');

let session = require('express-session');

const redisStorage = require('connect-redis')(session),
	redisClient = redis.createClient({host:'host',port:port,username:username,password:'password'});

module.exports = redisClient;

let store = new redisStorage({
		host: 'host',
		port: port,
		username:username,
		password:'password',
		client: redisClient,
		ttl: ttl
	});

let uuid = require('uuid');

const homeRouter = require("./routes/homeRouter.js"),
	adminRouter = require("./routes/adminRouter.js"),
	newsRouter = require("./routes/newsRouter.js"),
	path = require('path');

app.engine("hbs", expressHbs.engine(
    {
        layoutsDir: "views/layouts", 
        defaultLayout: "layout",
        extname: "hbs"
    }
));
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
	session({
		store: store,
		name:'name',
		secret: 'secret',
		genid: function(req) { return uuid.v4(); },
		resave: true,
		saveUninitialized: true,
		cookie: { secure: false,expires:3600000 }
	})
);

app.use(fileUpload({}));

app.use("/administrative/", adminRouter);
app.use("/news/", newsRouter);
app.use("/", homeRouter);

app.use('/robots.txt', function (req, res, next) {
	
	let fullUrl = 'https://' + req.get('host') + '/';
	
	res.type('text/plain');
	res.send("User-agent: *\nHost: "+fullUrl+"\nSitemap: "+fullUrl+"static/map/sitemap.xml");
});

app.use("/static",express.static(path.join(__dirname, '/public')));

app.use(function (req, res, next) {
    res.status(404).render("404.hbs", {
							title: 'Ошибка 404',
							description: 'Запрошенная страница не существует',
							keywords: 'ошибка, 404, страница, отсутствует'
						});
});

mongoose.connect("mongodb://", { useUnifiedTopology: true, useNewUrlParser: true });

app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});