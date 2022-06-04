const Settings = require("../models/settings.js");

exports.index = function (request, response) {
	
	let fullUrl = 'https://' + request.get('host') + request.originalUrl;
	
	Settings.find({}, function(err, doc){
		
		if (err || !doc || doc.length == 0) return response.status(404).render("404.hbs", {
						title: 'Ошибка 404',
						description: 'Запрошенная страница не существует',
						keywords: 'ошибка, 404, страница, отсутствует'
					});
		
		response.render("main.hbs",{title: doc[0]['title'],
							description: doc[0]['description'],
							keywords: doc[0]['keys'],
							image_cover: 'https://' + request.get('host') + '/static/uploads/' + doc[0]['img'],
							url_page: fullUrl});
	
    });
	
};