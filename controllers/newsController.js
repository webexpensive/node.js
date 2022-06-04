const Admins = require("../models/admin.js"),
	News = require("../models/news.js"),
	Settings = require("../models/settings.js"),
	session = require('express-session'),
	fileUpload = require('express-fileupload'),
	{ validationResult } = require("express-validator"),
	bbcode = require('node-bbcode');

let uuid = require('uuid'),
	crypto = require('crypto'),
	ip = require('ip');

exports.getNewsList = function (request, response) {
	
	let fullUrl = 'https://' + request.get('host') + request.originalUrl;
	
	Settings.find({}, function(err, doc){
	
		if (err || !doc || doc.length == 0) return response.status(404).render("404.hbs", {
						title: 'Ошибка 404',
						description: 'Запрошенная страница не существует',
						keywords: 'ошибка, 404, страница, отсутствует'
					});
	
		response.render("news_list.hbs",{title: 'Новости - ' + doc[0]['title'],
							description: doc[0]['description'],
							keywords: doc[0]['keys'],
							image_cover: 'https://' + request.get('host') + '/static/uploads/' + doc[0]['img'],
							url_page: fullUrl});
		
	});
};

exports.postNewsLoad = function(request, response){
	
	if ( !request.body.page ) return response.sendStatus(400);
	
    let page_post = request.body.page,
		perPage = 5,
		page = Math.max(0, page_post);
    
	News.find({},{ _id: 0, content: 0, __v: 0 }).limit(perPage).skip(perPage * page).sort([['date_add', -1]]).exec(function(err, allNews) {
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

exports.getNews = function (request, response) {
	
	const errors = validationResult(request);

    if (!errors.isEmpty()) return response.status(404).render("404.hbs", {
						title: 'Ошибка 404',
						description: 'Запрошенная страница не существует',
						keywords: 'ошибка, 404, страница, отсутствует'
					});
	
	let fullUrl = 'https://' + request.get('host') + request.originalUrl;
	
	News.find({url:request.params.url}, function(err, allNews){
	  
		if (err || !allNews || allNews.length == 0) return response.status(404).render("404.hbs", {
						title: 'Ошибка 404',
						description: 'Запрошенная страница не существует',
						keywords: 'ошибка, 404, страница, отсутствует'
					});
		
		allNews[0]['content'] = bbcode.render(allNews[0]['content'],{classPrefix: 'bbcode',newLine:true,allowData:false,allowClasses:false});
		
		allNews[0]['date_add'] = new Date(allNews[0]['date_add']).toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
		
		response.render("news.hbs", {
			news: allNews,
			title: allNews[0]['title'],
			description: allNews[0]['description'],
			keywords: allNews[0]['keys'],
			image_cover: 'https://' + request.get('host') + '/static/uploads/' + allNews[0]['img'],
			url_page: fullUrl
		});
		
	}).lean();
	
};