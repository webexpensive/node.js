const Admins = require("../models/admin.js"),
	News = require("../models/news.js"),
	Logs = require("../models/logs.js"),
	Settings = require("../models/settings.js"),
	session = require('express-session'),
	fileUpload = require('express-fileupload'),
	{ validationResult } = require("express-validator");

let uuid = require('uuid'),
	crypto = require('crypto'),
	fs = require('fs'),
	ip = require('ip');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}
 
exports.getAdmin = function(request, response){
	
	if ( request.session.admin ) {
		
		Admins.find({code_auth:request.session.admin}, function(err, doc){
	  
			if( err ) {
				request.session.admin.destroy();
				return response.status(404).render("404.hbs", {
						title: 'Ошибка 404',
						description: 'Запрошенная страница не существует',
						keywords: 'ошибка, 404, страница, отсутствует'
					});
			}
	  
			if( !doc || doc.length == 0 ) {
				request.session.admin.destroy();
				return response.render("admin.hbs", {
							title: 'Панель управления',
							description: 'Авторизация в панели управления',
							keywords: 'панель, управления, вход, авторизация'
						});
			}
			
		});
		
		response.render("panel", {
			title: 'Панель управления',
			description: 'Управление сайтом',
			keywords: 'панель, управления'
		});
		
	} else {
		
		response.render("admin.hbs", {
			title: 'Панель управления',
			description: 'Авторизация в панели управления',
			keywords: 'панель, управления, вход, авторизация'
		});
	}
};

exports.postLogin = function(request, response){
	
    const errors = validationResult(request);

    if (!errors.isEmpty()) return response.send({ error: errors.array()[0]['msg'] });
	
	if ( request.session.admin ) return response.sendStatus(400);
	
    let login = request.body.login,
    password_auth = request.body.password_auth,
	hashedPassword = getHashedPassword(password_auth);
	
    Admins.find({login:login,password:hashedPassword}, function(err, doc){
  
        if( err ) return response.sendStatus(500);
		
		if (!doc || doc.length == 0) {
			const logs = new Logs({ip: request.headers["x-real-ip"], login: login, status_attempt: 0, date_ch: new Date()});
	
			logs.save(function(err){
				if(err) response.sendStatus(500);
			});
			return response.send({ error: 'Неверные логин/пароль' });
		}
		
		let obj = Object.assign({}, doc),
		temp_session = uuid.v4();
		
		Admins.findOneAndUpdate({"login":login,"password":hashedPassword}, { "$set": {"code_auth": temp_session, "date_auth": new Date()}},{returnNewDocument: true},function (err, documents) {});
		
		const logs = new Logs({ip: request.headers["x-real-ip"], login: login, status_attempt: 1, date_ch: new Date()});
	
		logs.save(function(err){
			if(err) response.sendStatus(500);
		});
		
		request.session.admin = temp_session;
		
        response.send({ ok: true });
    });
    
};

exports.postNewsAdd = function(request, response){
	
	const errors = validationResult(request);

    if (!errors.isEmpty()) return response.send({ error: errors.array()[0]['msg'] });
	
	if(!request.files) return response.send({ error: 'Не выбран файл для обложки' });
	
	if(!request.session.admin) return response.sendStatus(400);
	
	if (!request.files.filedata_news || Object.keys(request.files).length === 0) {
		return response.status(400).send({ error: 'Не выбран файл для обложки' });
	}
	
    let title_news = request.body.title_news,
		url_news = request.body.url_news,
		description_news = request.body.description_news,
		keys_news = request.body.keys_news,
		text_news = request.body.text_news,
		text_short_news = request.body.text_news_short,
		file = request.files.filedata_news;
		
	let file_name = new Date().getTime() +'_'+file.name;
	const path = "/public/uploads/" + file_name;
	
	file.mv(path, (err) => {
		if (err) return response.sendStatus(500);
	});
	
	const news = new News({title: title_news, url: url_news, description: description_news, keys: keys_news, img: file_name, content_short: text_short_news, content: text_news, date_add: new Date()});
	
	news.save(function(err){
		if(err) response.sendStatus(500);
		response.send({ ok: true });
	});
    
};

exports.postNewsDelete = function(request, response){
	
	const errors = validationResult(request);

    if (!errors.isEmpty()) return response.send({ error: errors.array()[0]['msg'] });
	
	if ( !request.session.admin ) return response.sendStatus(400);
	
    let id_news = request.body.id_news;
	
	News.find({_id:id_news}, function(err, doc){
		
		if(err) return response.sendStatus(400);
		
		if (!doc || doc.length == 0) {
			return response.send({ error: 'Ошибка запроса' });
		}
	
		News.deleteOne({_id:id_news}, function(err, result){
		 
			if (err) return response.sendStatus(400);
			
			let filePath = '/public/uploads/' + doc[0].img; 
			fs.unlinkSync(filePath);
			
			response.send({ ok: true });
		});
		
	});
    
};

exports.postNewsLoad = function(request, response){
	
	if ( !request.body.page || !request.session.admin ) return response.sendStatus(400);
	
    let page_post = request.body.page,
		perPage = 5,
		page = Math.max(0, page_post);
    
	News.find().limit(perPage).skip(perPage * page).sort([['date_add', -1]]).exec(function(err, allNews) {
        News.count().exec(function(err, count) {
			response.status(200).json({
				status: 'succes',
				data: allNews,
				page: page,
                pages: count / perPage
			})
        });
    });
    
};

exports.postLogsLoad = function(request, response){
	
	if ( !request.body.page || !request.session.admin ) return response.sendStatus(400);
	
    let page_post = request.body.page,
		perPage = 5,
		page = Math.max(0, page_post);
    
	Logs.find().limit(perPage).skip(perPage * page).sort([['date_ch', -1]]).exec(function(err, allLogs) {
        Logs.count().exec(function(err, count) {
			response.status(200).json({
				status: 'succes',
				data: allLogs,
				page: page,
                pages: count / perPage
			})
        });
    });
    
};

exports.postSettingsLoad = function(request, response){
	
	if ( !request.session.admin ) return response.sendStatus(400);
    
	Settings.find({}, function(err, doc){
		response.status(200).json({
			status: 'succes',
			data: doc
		})
    });

};

exports.postNewsEditLoad = function(request, response){
	
	if ( !request.params.url || !request.session.admin ) return response.sendStatus(400);
	
    let id_news = request.params.url;
    
	News.find({url:request.params.url}, function(err, allNews){
	  
		if (err || !allNews || allNews.length == 0) return response.status(404).render("404.hbs", {
						title: 'Ошибка 404',
						description: 'Запрошенная страница не существует',
						keywords: 'ошибка, 404, страница, отсутствует'
					});
		
		response.render("news_edit.hbs", {
			news: allNews,
			title: 'Редактирование новости'
		});
		
	}).lean();
    
};

exports.postNewsEdit = function(request, response){
	
	const errors = validationResult(request);

    if (!errors.isEmpty()) return response.send({ error: errors.array()[0]['msg'] });
	
	if(!request.session.admin) return response.sendStatus(400);
	
    let id_news = request.body.id_news,
		title_news = request.body.title_news,
		url_news = request.body.url_news,
		description_news = request.body.description_news,
		keys_news = request.body.keys_news,
		text_news = request.body.text_news,
		text_short_news = request.body.text_news_short;	
		
	if ( request.files ) {
		
		if (!request.files.filedata_news || Object.keys(request.files).length === 0) {
			return response.status(400).send({ error: 'Не выбран файл для обложки' });
		}
		
		let file = request.files.filedata_news;
		
		let file_name = new Date().getTime() +'_'+file.name;
		const path = "/public/uploads/" + file_name;
		
		file.mv(path, (err) => {
			if (err) return response.sendStatus(500);
		});
		
		News.find({_id:id_news}, function(err, doc){
		
			if(err) return response.sendStatus(400);
			
			if (!doc || doc.length == 0) {
				return response.send({ error: 'Ошибка запроса' });
			}
		
			let filePath = '/public/uploads/' + doc[0].img; 
			fs.unlinkSync(filePath);
				
		});
		
		News.findOneAndUpdate({"_id":id_news}, { "$set": {"img": file_name}},{returnNewDocument: true},function (err, documents) {if (err) return response.sendStatus(400);});
		
	}
	
	News.findOneAndUpdate({"_id":id_news}, { "$set": {"title": title_news, "url": url_news, "description": description_news, "keys": keys_news, "content_short": text_short_news, "content": text_news}},{returnNewDocument: true},function (err, documents) {if (err) return response.sendStatus(400);});
	
	response.send({ ok: true });
    
};

exports.postSettingsEdit = function(request, response){
	
	const errors = validationResult(request);

    if (!errors.isEmpty()) return response.send({ error: errors.array()[0]['msg'] });
	
	if(!request.session.admin) return response.sendStatus(400);
	
    let title_setting = request.body.title_setting,
		description_setting = request.body.description_setting,
		keys_setting = request.body.keys_setting;	
		
	if ( request.files ) {
		
		if (!request.files.filedata_setting || Object.keys(request.files).length === 0) {
			return response.status(400).send({ error: 'Не выбран файл для обложки' });
		}
		
		let file = request.files.filedata_setting;
		
		let file_name = new Date().getTime() +'_'+file.name;
		const path = "/public/uploads/" + file_name;
		
		file.mv(path, (err) => {
			if (err) return response.sendStatus(500);
		});
		
		Settings.find({}, function(err, doc){
		
			if(err) return response.sendStatus(400);
			
			if (!doc || doc.length == 0) {
				return response.send({ error: 'Ошибка запроса' });
			}
		
			let filePath = '/public/uploads/' + doc[0].img; 
			fs.unlinkSync(filePath);
				
		});
		
		Settings.findOneAndUpdate({}, { "$set": {"img": file_name}},{returnNewDocument: true},function (err, documents) {if (err) return response.sendStatus(400);});
		
	}
	
	Settings.findOneAndUpdate({}, { "$set": {"title": title_setting, "description": description_setting, "keys": keys_setting}},{returnNewDocument: true},function (err, documents) {if (err) return response.sendStatus(400);});
	
	response.send({ ok: true });
    
};

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

exports.postMapEdit = function(request, response){
	
	const errors = validationResult(request);

    if (!errors.isEmpty()) return response.send({ error: errors.array()[0]['msg'] });
	
	if ( !request.session.admin ) return response.sendStatus(400);
	
    let fileList = '/public/map/sitemap.xml',
		fullUrl = 'https://' + request.get('host') + '/',
		today = new Date().toISOString().slice(0, 10),
		data = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
		
		data += '<url><loc>'+fullUrl+'</loc><lastmod>'+today+'</lastmod><priority>0.5</priority></url>';
		
		data += '<url><loc>'+fullUrl+'news/</loc><lastmod>'+today+'</lastmod><priority>0.5</priority></url>';
		
		News.find({}, function(err, allNews){
		
			for (let i=0; i<allNews.length;i++) {
				
				data += '<url><loc>'+fullUrl+'news/'+allNews[i]['url']+'/</loc><lastmod>'+formatDate(allNews[i]['date_add'])+'</lastmod><priority>0.5</priority></url>';
				
			}
			
			data += '</urlset>';
	
			fs.writeFile(fileList, data, function(err) {
				if( err ) return response.send({ error: err });
				response.send({ ok: true });
			});
		});
    
};