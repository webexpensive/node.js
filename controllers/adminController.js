import Admins from "../models/admin.js";
import News from "../models/news.js";
import Programming from "../models/programming.js";
import Logs from "../models/logs.js";
import Files from "../models/files.js";
import erAuth from "../models/error_auth.js";
import Settings from "../models/settings.js";
import { validationResult } from "express-validator";
import nodeHtmlToImage from 'node-html-to-image'
import bbcode from 'node-bbcode';

import * as uuid from 'uuid';
import crypto from 'crypto';
import fs from 'fs';
import ip from 'ip';

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

function getExtension(filename) {
	return filename.split('.').pop();
}

function isCheckFiles(fileName) {
    let allowfiles = ["jpg", "jpeg", "png"];
    if(allowfiles.indexOf(fileName) > -1) {
        return true;
    } else {
        return false;
    }
}
 
export async function getAdmin(request, response){
	
	if ( request.session.admin ) {
		
		let docD = await Admins.find({code_auth:request.session.admin}).exec();
	  
		if( !docD || docD.length == 0 ) {
			request.session.admin.destroy();
			return response.render("admin.hbs", {
						title: 'Панель управления',
						description: 'Авторизация в панели управления',
						keywords: 'панель, управления, вход, авторизация'
					});
		} else {
			
			return response.render("panel", {
				title: 'Панель управления',
				description: 'Управление сайтом',
				keywords: 'панель, управления'
			});
			
		}
		
	} else {
		
		return response.render("admin.hbs", {
			title: 'Панель управления',
			description: 'Авторизация в панели управления',
			keywords: 'панель, управления, вход, авторизация'
		});
	}
};

export async function postLogin(request, response){
	//global.io.to(global.clients).emit('message', "I'm admin"+global.clients);
	//global.io.sockets.emit('message', "I not");
    const errors = validationResult(request);

    if (!errors.isEmpty()) return response.send({ error: errors.array()[0]['msg'] });
	
	if ( request.session.admin ) return response.sendStatus(400);
	
    let login = request.body.login,
		password_auth = request.body.password_auth,
		hashedPassword = getHashedPassword(password_auth);
	
	let doc_auth = await erAuth.find({ip: request.headers["x-real-ip"], count_at: { $gte: 3}}).exec();
		
		if ( doc_auth && doc_auth.length > 0) {
				
			return response.send({ error: 'Превышение попыток авторизации' });
			
		} else {
			
			let docD = await Admins.find({login:login,password:hashedPassword}).exec();

				if (!docD || docD.length == 0) {
					
					let doc_auth_w = await erAuth.find({ip: request.headers["x-real-ip"]}).exec();
						
					if (!doc_auth_w || doc_auth_w.length == 0) {
						
						const logs_auth = new erAuth({ip: request.headers["x-real-ip"]});

						await logs_auth.save();
						
					} else {
						
						await erAuth.findOneAndUpdate({ip: request.headers["x-real-ip"]}, { "$inc": {"count_at": 1}},{returnNewDocument: true}).exec();
						
					}
					
					const logs = new Logs({ip: request.headers["x-real-ip"], login: login, status_attempt: 0, date_ch: new Date()});

					await logs.save();
				
					return response.send({ error: 'Неверные логин/пароль' });
					
				} else {
				
					let temp_session = uuid.v4();
					
					await Admins.findOneAndUpdate({"login":login,"password":hashedPassword}, { "$set": {"code_auth": temp_session, "date_auth": new Date()}},{returnNewDocument: true}).exec();
					
					const logs = new Logs({ip: request.headers["x-real-ip"], login: login, status_attempt: 1, date_ch: new Date()});
				
					await logs.save();
					
					request.session.admin = temp_session;
					
					return response.send({ ok: true });
					
				}
			
		}
    
};

export async function postNewsAdd(request, response){
	
	const errors = validationResult(request);

    if (!errors.isEmpty()) return response.send({ error: errors.array()[0]['msg'] });
	
	if(!request.files) return response.send({ error: 'Не выбран файл для обложки' });
	
	if(!request.session.admin) return response.sendStatus(400);
	
	if (!request.files.filedata_news || Object.keys(request.files).length === 0) {
		return response.status(400).send({ error: 'Не выбран файл для обложки' });
	}
	
	if (!/^(0|[0-1]\d*)$/.test(request.body.visibility_news)) return response.sendStatus(400);
	
    let title_news = request.body.title_news,
		url_news = request.body.url_news,
		description_news = request.body.description_news,
		keys_news = request.body.keys_news,
		text_news = request.body.text_news,
		text_short_news = request.body.text_news_short,
		visibility_news = Number(request.body.visibility_news),
		file = request.files.filedata_news;
		
	let ch_file_m = getExtension(file.name);
		
	if (!isCheckFiles(ch_file_m)) return response.status(400).send({ error: 'Неверный формат обложки' });
		
	let file_name = new Date().getTime() +'_'+file.name;
	const path = "/home/www/public/uploads/" + file_name;
	
	file.mv(path, (err) => {
		if (err) return response.sendStatus(500);
	});
	
	const news = new News({title: title_news, url: url_news, description: description_news, keys: keys_news, img: file_name, content_short: text_short_news, content: text_news, date_add: new Date(), visibility: visibility_news});
	await news.save();

	return response.send({ ok: true });
    
};

export async function postProgrammingAdd(request, response){
	
	const errors = validationResult(request);

    if (!errors.isEmpty()) return response.send({ error: errors.array()[0]['msg'] });
	
	if(!request.session.admin) return response.sendStatus(400);
	
	if (!/^(0|[0-1]\d*)$/.test(request.body.visibility_programming)) return response.sendStatus(400);
	
    let title_programming = request.body.title_programming,
		url_programming = request.body.url_programming,
		description_programming = request.body.description_programming,
		keys_programming = request.body.keys_programming,
		text_programming = request.body.text_programming,
		text_short_programming = request.body.text_programming_short,
		visibility_programming = Number(request.body.visibility_programming);
	
	let file_name = new Date().getTime() +'_'+url_programming+'.png';
	
	nodeHtmlToImage({
		output: '/home/www/public/cover/'+file_name,
		html: '<html><head><link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet"><link href="https://fonts.googleapis.com/css?family=Roboto+Condensed:300,400,700" rel="stylesheet"><style>html{width: 1300px;} body { font-family: "Roboto Condensed", sans-serif;font-size: 50px;line-height: 1.2;color: #ffffff;font-weight: 700;letter-spacing: 1px;height: 572px;background-image: -webkit-linear-gradient(0deg,#4cd4e3 0%,#3e69fe 100%);overflow:  hidden;}div.container4 { height: 10em;position: relative }div.container4 p {margin: 0;position: absolute;top: 50%;left: 50%;margin-right: -50%;transform: translate(-50%, -50%) }.copy {margin: 0;position: absolute;bottom: 5%;left: 2%;font-size: 20px; }.sayt {margin: 0;position: absolute;top: 2%;right: 2%;font-size: 20px; } </style></head><body><div class=container4><p>'+title_programming+'</p></div><div class="copy">Fullstack-разработчик в Москве - Node.JS, Vue.js, Express, Redis, MongoDB</div><div class="sayt">node.webexpensive.ru</div></body></html>'
	});
	
	const programming = new Programming({title: title_programming, url: url_programming, description: description_programming, keys: keys_programming, img: file_name, content_short: text_short_programming, content: text_programming, date_add: new Date(), visibility: visibility_programming});
	await programming.save();

	return response.send({ ok: true });
    
};

export async function postFilesLoad(request, response){
	
	if(!request.files) return response.send({ error: 'Не выбран файл' });
	
	if(!request.session.admin) return response.sendStatus(400);
	
	if (!request.files.filedata_nodefiles || Object.keys(request.files).length === 0) {
		return response.status(400).send({ error: 'Не выбран файл' });
	}
		
    let fileD = request.files.filedata_nodefiles,
		file_name,
		path,
		files;
	
	if ( fileD.length !== undefined ) {
	
		for (let i=0; i<Object.keys(fileD).length;i++) {
	
			file_name = new Date().getTime() +'_'+fileD[i].name;
			path = "/home/www/public/files/" + file_name;
			
			fileD[i].mv(path, (err) => {
				if (err) return response.sendStatus(500);
			});
			
			files = new Files({title: file_name, date_add: new Date()});
			await files.save();
			
		}
	
	} else {
		
		file_name = new Date().getTime() +'_'+fileD.name;
		path = "/home/www/public/files/" + file_name;
	
		fileD.mv(path, (err) => {
			if (err) return response.sendStatus(500);
		});
		
		files = new Files({title: file_name, date_add: new Date()});
		await files.save();
		
	}
	
	return response.send({ ok: true });
    
};

export async function postNewsDelete(request, response){
	
	const errors = validationResult(request);

    if (!errors.isEmpty()) return response.send({ error: errors.array()[0]['msg'] });
	
	if ( !request.session.admin ) return response.sendStatus(400);
	
    let id_news = request.body.id_news;
	
	let docD = await News.find({_id:id_news}).exec();
		
	if (!docD || docD.length == 0) {
		return response.send({ error: 'Ошибка запроса' });
	}

	await News.deleteOne({_id:id_news}).exec();
	
	let filePath = '/home/www/public/uploads/' + doc[0].img; 
	fs.unlinkSync(filePath);
	
	return response.send({ ok: true });
    
};

export async function postProgrammingDelete(request, response){
	
	const errors = validationResult(request);

    if (!errors.isEmpty()) return response.send({ error: errors.array()[0]['msg'] });
	
	if ( !request.session.admin ) return response.sendStatus(400);
	
    let id_programming = request.body.id_programming;
	
	let docD = await Programming.find({_id:id_programming}).exec();
		
	if (!docD || docD.length == 0) {
		return response.send({ error: 'Ошибка запроса' });
	}
	
	await Programming.deleteOne({_id:id_programming}).exec();
	
	let filePath = '/home/www/public/cover/' + docD[0].img; 
	fs.unlinkSync(filePath);
	
	return response.send({ ok: true });
    
};

export async function postNewsLoad(request, response){
	
	if ( !request.body.page || !request.session.admin ) return response.sendStatus(400);
	
    let page_post = request.body.page,
		perPage = 5,
		page = Math.max(0, page_post);
    
	let allNews = await News.find().limit(perPage).skip(perPage * page).sort([['date_add', -1]]).exec();
	let countNews = await News.find().countDocuments().exec();
	return response.status(200).json({
		status: 'succes',
		data: allNews,
		page: page,
        pages: countNews / perPage
	});
    
};

export async function postProgrammingLoad(request, response){
	
	if ( !request.body.page || !request.session.admin ) return response.sendStatus(400);
	
    let page_post = request.body.page,
		perPage = 5,
		page = Math.max(0, page_post);
    
	let allProgramming = await Programming.find().limit(perPage).skip(perPage * page).sort([['date_add', -1]]).exec();
	let countProgramming = await Programming.find().countDocuments().exec();
	return response.status(200).json({
		status: 'succes',
		data: allProgramming,
		page: page,
	    pages: countProgramming / perPage
	});
    
};

export async function postLogsLoad(request, response){
	
	if ( !request.body.page || !request.session.admin ) return response.sendStatus(400);
	
    let page_post = request.body.page,
		perPage = 5,
		page = Math.max(0, page_post);
    
	let allLogs = await Logs.find().limit(perPage).skip(perPage * page).sort([['date_ch', -1]]).exec();
    let countLogs = await Logs.find().countDocuments().exec();
	return response.status(200).json({
		status: 'succes',
		data: allLogs,
		page: page,
        pages: countLogs / perPage
	});
    
};

export async function postSettingsLoad (request, response){
	
	if ( !request.session.admin ) return response.sendStatus(400);
    
	let docD = await Settings.find({}).exec();
	return response.status(200).json({
		status: 'succes',
		data: docD
	});

};

export async function postFilesLoadList(request, response){
	
	if ( !request.body.page || !request.session.admin ) return response.sendStatus(400);
	
    let page_post = request.body.page,
		perPage = 5,
		page = Math.max(0, page_post);
    
	let allFiles = await Files.find().limit(perPage).skip(perPage * page).sort([['date_add', -1]]).exec();
    let countFiles = await Files.find().countDocuments().exec();
	return response.status(200).json({
		status: 'succes',
		data: allFiles,
		page: page,
        pages: countFiles / perPage
	});
    
};

export async function postNewsEditLoad (request, response){
	
	if ( !request.params.url || !request.session.admin ) return response.sendStatus(400);
	
    let id_news = request.params.url;
    
	let allNews = await News.find({url:request.params.url}).lean();
	  
	if (!allNews || allNews.length == 0) return response.status(404).render("404.hbs", {
					title: 'Ошибка 404',
					description: 'Запрошенная страница не существует',
					keywords: 'ошибка, 404, страница, отсутствует'
				});
	
	return response.render("news_edit.hbs", {
		news: allNews,
		title: 'Редактирование новости'
		});
    
};

export async function postProgrammingEditLoad(request, response){
	
	if ( !request.params.url || !request.session.admin ) return response.sendStatus(400);
	
    let id_programming = request.params.url;
    
	let allProgramming = await Programming.find({url:request.params.url}).lean();
	  
	if (!allProgramming || allProgramming.length == 0) return response.status(404).render("404.hbs", {
					title: 'Ошибка 404',
					description: 'Запрошенная страница не существует',
					keywords: 'ошибка, 404, страница, отсутствует'
				});
	
	return response.render("programming_edit.hbs", {
		programming: allProgramming,
		title: 'Редактирование статьи'
	});
    
};

export async function postNewsEdit(request, response){
	
	const errors = validationResult(request);

    if (!errors.isEmpty()) return response.send({ error: errors.array()[0]['msg'] });
	
	if(!request.session.admin) return response.sendStatus(400);
	
	if (!/^(0|[0-1]\d*)$/.test(request.body.visibility_news)) return response.sendStatus(400);
	
    let id_news = request.body.id_news,
		title_news = request.body.title_news,
		url_news = request.body.url_news,
		description_news = request.body.description_news,
		keys_news = request.body.keys_news,
		text_news = request.body.text_news,
		visibility_news = Number(request.body.visibility_news),
		text_short_news = request.body.text_news_short;	
		
	if ( request.files ) {
		
		if (!request.files.filedata_news || Object.keys(request.files).length === 0) {
			return response.status(400).send({ error: 'Не выбран файл для обложки' });
		}
		
		let fileD = request.files.filedata_news;
		
		let ch_file_m = getExtension(fileD.name);
		
		if (!isCheckFiles(ch_file_m)) return response.status(400).send({ error: 'Неверный формат обложки' });
		
		let file_name = new Date().getTime() +'_'+fileD.name;
		const path = "/home/www/public/uploads/" + file_name;
		
		fileD.mv(path, (err) => {
			if (err) return response.sendStatus(500);
		});
		
		let ResultNews = await News.find({_id:id_news}).exec();
			
		if (!ResultNews || ResultNews.length == 0) {
			return response.send({ error: 'Ошибка запроса' });
		}
	
		let filePath = '/home/www/public/uploads/' + doc[0].img; 
		fs.unlinkSync(filePath);
				
		
		await News.findOneAndUpdate({"_id":id_news}, { "$set": {"img": file_name}},{returnNewDocument: true}).exec();
		
	}
	
	await News.findOneAndUpdate({"_id":id_news}, { "$set": {"title": title_news, "url": url_news, "description": description_news, "keys": keys_news, "content_short": text_short_news, "content": text_news, "visibility": visibility_news}},{returnNewDocument: true}).exec();
	
	return response.send({ ok: true });
    
};

export async function postProgrammingEdit(request, response){
	
	const errors = validationResult(request);

    if (!errors.isEmpty()) return response.send({ error: errors.array()[0]['msg'] });
	
	if(!request.session.admin) return response.sendStatus(400);
	
	if (!/^(0|[0-1]\d*)$/.test(request.body.visibility_programming)) return response.sendStatus(400);
	
    let id_programming = request.body.id_programming,
		title_programming = request.body.title_programming,
		url_programming = request.body.url_programming,
		description_programming = request.body.description_programming,
		keys_programming = request.body.keys_programming,
		text_programming = request.body.text_programming,
		visibility_programming = Number(request.body.visibility_programming),
		text_short_programming = request.body.text_programming_short;	
	
	await Programming.findOneAndUpdate({"_id":id_programming}, { "$set": {"title": title_programming, "url": url_programming, "description": description_programming, "keys": keys_programming, "content_short": text_short_programming, "content": text_programming, "visibility": visibility_programming}},{returnNewDocument: true}).exec();
	
	return response.send({ ok: true });
    
};

export async function postSettingsEdit(request, response){
	
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
		
		let fileD = request.files.filedata_setting;
		
		let file_name = new Date().getTime() +'_'+fileD.name;
		const path = "/home/www/public/uploads/" + file_name;
		
		fileD.mv(path, (err) => {
			if (err) return response.sendStatus(500);
		});
		
		let SettingOptions = await Settings.find({}).exec();
		
		if (!SettingOptions || SettingOptions.length == 0) {
			return response.send({ error: 'Ошибка запроса' });
		}
	
		let filePath = '/home/www/public/uploads/' + SettingOptions[0].img; 
		fs.unlinkSync(filePath);
		
		await Settings.findOneAndUpdate({}, { "$set": {"img": file_name}},{returnNewDocument: true}).exec();
		
	}
	
	await Settings.findOneAndUpdate({}, { "$set": {"title": title_setting, "description": description_setting, "keys": keys_setting}},{returnNewDocument: true}).exec();
	
	return response.send({ ok: true });
    
};

function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

export async function postMapEdit(request, response){
	
	const errors = validationResult(request);

    if (!errors.isEmpty()) return response.send({ error: errors.array()[0]['msg'] });
	
	if ( !request.session.admin ) return response.sendStatus(400);
	
    let fileList = '/home/www/public/map/sitemap.xml',
		fullUrl = 'https://' + request.get('host') + '/',
		today = new Date().toISOString().slice(0, 10),
		data = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		fileListRss = '/home/www/public/map/rss.xml',
		fullUrlRss = 'https://' + request.get('host') + '/',
		todayRss = new Date().toISOString().slice(0, 10),
		dataRss = '<?xml version="1.0" encoding="UTF-8"?><rss xmlns:yandex="http://news.yandex.ru" xmlns:media="http://search.yahoo.com/mrss/" xmlns:turbo="http://turbo.yandex.ru" version="2.0"><channel><title>Fullstack-разработчик в Москве - Node.JS, Vue.js, Express, Redis, MongoDB</title><link>'+fullUrl+'</link><description>Проектирование и разработка web-приложений под ключ. Профессиональная разработка веб-приложений на Node.js с использованием Express.</description><language>ru</language><turbo:analytics type="Yandex" id="89231959"></turbo:analytics>';
		
		data += '<url><loc>'+fullUrl+'</loc><lastmod>'+today+'</lastmod><priority>0.5</priority></url>';
		
		data += '<url><loc>'+fullUrl+'services/</loc><lastmod>'+today+'</lastmod><priority>0.5</priority></url>';
		
		data += '<url><loc>'+fullUrl+'services/lendingi/</loc><lastmod>'+today+'</lastmod><priority>0.5</priority></url>';
		
		data += '<url><loc>'+fullUrl+'services/lichnye-kabinety/</loc><lastmod>'+today+'</lastmod><priority>0.5</priority></url>';
		
		data += '<url><loc>'+fullUrl+'services/korporativnye-sajty/</loc><lastmod>'+today+'</lastmod><priority>0.5</priority></url>';
		
		data += '<url><loc>'+fullUrl+'news/</loc><lastmod>'+today+'</lastmod><priority>0.5</priority></url>';
		
		let allNews = await News.find({}).exec();
		
		for (let i=0; i<allNews.length;i++) {
			
			data += '<url><loc>'+fullUrl+'news/'+allNews[i]['url']+'/</loc><lastmod>'+formatDate(allNews[i]['date_add'])+'</lastmod><priority>0.5</priority></url>';

			dataRss += '<item turbo="true"><link>'+fullUrl+'news/'+allNews[i]['url']+'/</link><turbo:content><![CDATA[<header><h1>'+allNews[i]['title']+'</h1><menu><a href="https://node.webexpensive.ru/">Разработка интернет-приложений</a><a href="https://node.webexpensive.ru/services/">Услуги</a><a href="https://node.webexpensive.ru/news/">Новости</a><a href="https://node.webexpensive.ru/programming/">Программирование</a></menu></header>'+bbcode.render(allNews[i]['content'],{classPrefix: "bbcode",newLine:true,allowData:false,allowClasses:false})+ ']]></turbo:content></item>';
			
		}

		data += '<url><loc>'+fullUrl+'programming/</loc><lastmod>'+today+'</lastmod><priority>0.5</priority></url>';
		
		let allProgramming = await Programming.find({}).exec();
			
		for (let i=0; i<allProgramming.length;i++) {
			
			data += '<url><loc>'+fullUrl+'programming/'+allProgramming[i]['url']+'/</loc><lastmod>'+formatDate(allProgramming[i]['date_add'])+'</lastmod><priority>0.5</priority></url>';

			dataRss += '<item turbo="true"><link>'+fullUrl+'programming/'+allProgramming[i]['url']+'/</link><turbo:content><![CDATA[<header><h1>'+allProgramming[i]['title']+'</h1><menu><a href="https://node.webexpensive.ru/">Разработка интернет-приложений</a><a href="https://node.webexpensive.ru/services/">Услуги</a><a href="https://node.webexpensive.ru/news/">Новости</a><a href="https://node.webexpensive.ru/programming/">Программирование</a></menu></header>'+bbcode.render(allProgramming[i]['content'],{classPrefix: "bbcode",newLine:true,allowData:false,allowClasses:false})+ ']]></turbo:content></item>';

		}
		
		data += '</urlset>';
		dataRss += '</channel></rss>';

		fs.writeFile(fileList, data, function(err) {
			if( err ) return response.send({ error: err });
		});

		fs.writeFile(fileListRss, dataRss, function(err) {
			if( err ) return response.send({ error: err });		
		});

		response.send({ ok: true });
    
};

export async function postFilesDelete(request, response){
	
	const errors = validationResult(request);

    if (!errors.isEmpty()) return response.send({ error: errors.array()[0]['msg'] });
	
	if ( !request.session.admin ) return response.sendStatus(400);
	
    let id_files = request.body.id_files;
	
	let ResultFiles = await Files.find({_id:id_files}).exec();
		
	if (!ResultFiles || Object.keys(ResultFiles).length === 0) return response.sendStatus(400);

	await Files.deleteOne({_id:id_files}).exec();
		
	let filePath = '/home/www/public/files/' + doc[0].title; 
	fs.unlinkSync(filePath);
	
	return response.send({ ok: true });
    
};