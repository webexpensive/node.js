import Admins from "../models/admin.js";
import Programming from "../models/programming.js";
import Settings from "../models/settings.js";
import { validationResult } from "express-validator";
import bbcode from 'node-bbcode';

export async function getProgrammingList (request, response) {
	
	let fullUrl = 'https://' + request.get('host') + request.originalUrl;
	
	let SettingOptions = await Settings.find({}).exec();
		
	if (!SettingOptions || Object.keys(SettingOptions).length === 0) {

		 return response.status(404).render("404.hbs", {
						title: 'Ошибка 404',
						description: 'Запрошенная страница не существует',
						keywords: 'ошибка, 404, страница, отсутствует'
					});
		}
	
		response.render("programming_list.hbs",{title: 'Веб-программирование: кейсы, лайфаки, статьи о карьере, идеях и трендах',
							description: 'Статьи про языки программирования, основы web-программирования.',
							keywords: SettingOptions[0]['keys'],
							image_cover: 'https://' + request.get('host') + '/static/uploads/' + SettingOptions[0]['img'],
							url_page: fullUrl});
		
};

export async function postProgrammingLoad (request, response){
	
	if ( !request.body.page ) return response.sendStatus(400);
	
	if (!/^(0|[0-9]\d*)$/.test(request.body.page)) return response.sendStatus(400);
	
    let page_post = Number(request.body.page),
		perPage = 12,
		page = Math.max(0, page_post);
    
	let allProgramming = await Programming.find({visibility:1},{ _id: 0, content: 0, __v: 0 }).limit(perPage).skip(perPage * page).sort([['date_add', -1]]).exec();
	let CountProgramming = await Programming.find({visibility:1},{ _id: 0, content: 0, __v: 0 }).countDocuments().exec();

	response.status(200).json({
		status: 'succes',
		data: allProgramming,
		page: page,
        pages: CountProgramming / perPage
	});
    
};

export async function getProgramming (request, response) {
	
	const errors = validationResult(request);

    if (!errors.isEmpty()) return response.status(404).render("404.hbs", {
						title: 'Ошибка 404',
						description: 'Запрошенная страница не существует',
						keywords: 'ошибка, 404, страница, отсутствует'
					});
	
	let fullUrl = 'https://' + request.get('host') + request.originalUrl;
	
	let allProgramming = await Programming.find({url:request.params.url, visibility:1}).lean();
	  
		if (!allProgramming || Object.keys(allProgramming).length === 0) {
		 return response.status(404).render("404.hbs", {
						title: 'Ошибка 404',
						description: 'Запрошенная страница не существует',
						keywords: 'ошибка, 404, страница, отсутствует'
					});
		}
		
		allProgramming[0]['content'] = bbcode.render(allProgramming[0]['content'],{classPrefix: 'bbcode',newLine:true,allowData:false,allowClasses:false});
		
		allProgramming[0]['date_add'] = new Date(allProgramming[0]['date_add']).toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
		
		response.render("programming.hbs", {
			programming: allProgramming,
			title: allProgramming[0]['title'],
			description: allProgramming[0]['description'],
			keywords: allProgramming[0]['keys'],
			image_cover: 'https://' + request.get('host') + '/static/cover/' + allProgramming[0]['img'],
			url_page: fullUrl
		});
	
};