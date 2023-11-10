import Admins from "../models/admin.js";
import Settings from "../models/settings.js";
import { validationResult } from "express-validator";
import bbcode from 'node-bbcode';

export async function getServicesList (request, response) {
	
	let fullUrl = 'https://' + request.get('host') + request.originalUrl;
	
	let SettingOptions = await Settings.find({}).exec();
		
	if (!SettingOptions || Object.keys(SettingOptions).length === 0) {

		 return response.status(404).render("404.hbs", {
						title: 'Ошибка 404',
						description: 'Запрошенная страница не существует',
						keywords: 'ошибка, 404, страница, отсутствует'
					});
		}
	
		response.render("services_list.hbs",{title: 'Создание сайтов под ключ',
							description: 'Закажите сайт для развития бизнеса. Создаю максимально удобные и продающие сайты с высокой конверсией. Современные технологии и актуальные решения.',
							keywords: SettingOptions[0]['keys'],
							image_cover: 'https://' + request.get('host') + '/static/img/services.jpg',
							url_page: fullUrl});
		

};

export async function getServicesFull1(request, response) {
	
	let fullUrl = 'https://' + request.get('host') + request.originalUrl;
	
	let SettingOptions = await Settings.find({}).exec();
		
	if (!SettingOptions || Object.keys(SettingOptions).length === 0) {

		 return response.status(404).render("404.hbs", {
						title: 'Ошибка 404',
						description: 'Запрошенная страница не существует',
						keywords: 'ошибка, 404, страница, отсутствует'
					});
		}
	
		response.render("services_full1.hbs",{title: 'Создание Landing Page',
							description: 'Закажите создание лендинга для быстрого старта Вашего бизнеса.',
							keywords: SettingOptions[0]['keys'],
							image_cover: 'https://' + request.get('host') + '/static/img/page-services-lendingi.jpg',
							url_page: fullUrl});
};

export async function getServicesFull2 (request, response) {
	
	let fullUrl = 'https://' + request.get('host') + request.originalUrl;
	
	let SettingOptions = await Settings.find({}).exec();
		
	if (!SettingOptions || Object.keys(SettingOptions).length === 0) {

		 return response.status(404).render("404.hbs", {
						title: 'Ошибка 404',
						description: 'Запрошенная страница не существует',
						keywords: 'ошибка, 404, страница, отсутствует'
					});
		}
	
		response.render("services_full2.hbs",{title: 'Создание личных онлайн-кабинетов',
							description: 'Создание личного кабинета для клиентов или сотрудников. Связка сайта с 1С.',
							keywords: SettingOptions[0]['keys'],
							image_cover: 'https://' + request.get('host') + '/static/img/page-services-lichnye-kabinety.jpg',
							url_page: fullUrl});
		
};

export async function getServicesFull3(request, response) {
	
	let fullUrl = 'https://' + request.get('host') + request.originalUrl;
	
	let SettingOptions = await Settings.find({}).exec();
		
	if (!SettingOptions || Object.keys(SettingOptions).length === 0) {

		 return response.status(404).render("404.hbs", {
						title: 'Ошибка 404',
						description: 'Запрошенная страница не существует',
						keywords: 'ошибка, 404, страница, отсутствует'
					});
		}
	
		response.render("services_full3.hbs",{title: 'Создание корпоративного сайта',
							description: 'Создание и продвижение сайтов под ключ, комплексное SEO продвижение сайтов. Разработаю корпоративный сайт под ключ любой сложности.',
							keywords: SettingOptions[0]['keys'],
							image_cover: 'https://' + request.get('host') + '/static/img/page-services-korporativnye-sajty.jpg',
							url_page: fullUrl});
		
};