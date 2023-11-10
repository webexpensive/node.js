import Admins from "../models/admin.js";
import News from "../models/news.js";
import Settings from "../models/settings.js";
import { validationResult } from "express-validator";
import bbcode from 'node-bbcode';

export async function getNewsList (request, response) {
	
	let fullUrl = 'https://' + request.get('host') + request.originalUrl;
	
	let SettingOptions = await Settings.find({}).exec();
		
	if (!SettingOptions || Object.keys(SettingOptions).length === 0) {

		 return response.status(404).render("404.hbs", {
						title: 'Ошибка 404',
						description: 'Запрошенная страница не существует',
						keywords: 'ошибка, 404, страница, отсутствует'
					});
		}
	
		response.render("news_list.hbs",{title: 'Свежие новости и статьи в сфере IT технологий',
							description: 'Новости из мира веб-программирования - дизайн, вёрстка, разработка бэкенда и фронда.',
							keywords: SettingOptions[0]['keys'],
							image_cover: 'https://' + request.get('host') + '/static/uploads/' + SettingOptions[0]['img'],
							url_page: fullUrl});
		
};

export async function postNewsLoad (request, response){
	
	if ( !request.body.page ) return response.sendStatus(400);
	
	if (!/^(0|[0-9]\d*)$/.test(request.body.page)) return response.sendStatus(400);
	
    let page_post = Number(request.body.page),
		perPage = 5,
		page = Math.max(0, page_post);
    
		let ResultNews = await News.find({visibility:1},{ _id: 0, content: 0, __v: 0 }).limit(perPage).skip(perPage * page).sort([['date_add', -1]]).exec();
        let CountNews = await News.find({visibility:1},{ _id: 0, content: 0, __v: 0 }).countDocuments().exec();

		response.status(200).json({
			status: 'succes',
			data: ResultNews,
			page: page,
            pages: CountNews / perPage
		});
    
};

export async function getNews (request, response) {
	
	const errors = validationResult(request);

    if (!errors.isEmpty()) return response.status(404).render("404.hbs", {
						title: 'Ошибка 404',
						description: 'Запрошенная страница не существует',
						keywords: 'ошибка, 404, страница, отсутствует'
					});
	
	let fullUrl = 'https://' + request.get('host') + request.originalUrl;
	
	let allNews = await News.find({url:request.params.url, visibility:1}).lean();
	  
	if (!allNews || Object.keys(allNews).length === 0) {
	 return response.status(404).render("404.hbs", {
					title: 'Ошибка 404',
					description: 'Запрошенная страница не существует',
					keywords: 'ошибка, 404, страница, отсутствует'
				});
	}
	
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
		
};