import Settings from "../models/settings.js";

export async function index(request, response) {
	
	let fullUrl = 'https://' + request.get('host') + request.originalUrl;
	
	let SettingOptions = await Settings.find({}).exec();
		
	if (!SettingOptions || Object.keys(SettingOptions).length === 0) {

		 return response.status(404).render("404.hbs", {
						title: 'Ошибка 404',
						description: 'Запрошенная страница не существует',
						keywords: 'ошибка, 404, страница, отсутствует'
					});
		}
		
		response.render("main.hbs",{title: SettingOptions[0]['title'],
							description: SettingOptions[0]['description'],
							keywords: SettingOptions[0]['keys'],
							image_cover: 'https://' + request.get('host') + '/static/uploads/' + SettingOptions[0]['img'],
							url_page: fullUrl});
	
};