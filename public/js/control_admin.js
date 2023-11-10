	let textarea = document.getElementById('text_news');
	sceditor.create(textarea, {
		format: 'bbcode',
		icons: 'monocons',
		style: '/static/minified/themes/content/default.min.css'
	});
	
	let textarea_pro = document.getElementById('text_programming');
	sceditor.create(textarea_pro, {
		format: 'bbcode',
		icons: 'monocons',
		style: '/static/minified/themes/content/default.min.css'
	});

	async function load_logs( page_limit ) {
		let formData = new FormData();
		formData.append("page", page_limit);

		let response = await fetch('/administrative/loadlogs/', {
			method: 'POST',
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(Object.fromEntries(formData))
		});

		let result = await response.json();

		if ( result.error ) {
			new a_toast({
				title: 'Ошибка',
				text: result.error,
				theme: 'danger',
				autohide: true,
				interval: 10000
			});
		} else {
			
			let mas_content_logs = '<tr><th>статус</th><th>ip</th><th>login</th><th>дата</th></tr>';
			
			for (let key in result.data) {
				let item = result.data[key];
				let newsdate = new Date(item.date_ch);	
				item.status_attempt = item.status_attempt == 1 ? '<p class="text-success">Успешно</p>' : '<p class="text-danger">Ошибка</p>';
				mas_content_logs += '<tr><td class="align-middle">'+item.status_attempt+'</td><td class="align-middle">'+item.ip+'</td><td class="align-middle">'+item.login+'</td><td class="align-middle">'+newsdate.toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })+'</td></tr>';
			}
			
			document.getElementById("logs_content_load").innerHTML = mas_content_logs;
			
			result.page = Number(result.page);
			result.pages = Number(result.pages);
			
			let page_num = '',
				page_num_next = 0,
				page_num_prev = 0,
				current_page = Number(result.page) + 1;
			
			page_num_next = Number(result.page)+1;
			page_num_prev = Number(result.page)-1;
			
			page_exit_next = Math.ceil(result.pages) - 1;
			page_exit_text = Math.ceil(result.pages);
			
			if ( result.page > 0 ) {
				page_num += '<div class="pad_pagin"><button class="btn btn-primary" onclick="load_logs(0)">1</button></div>';
				page_num += '<div class="pad_pagin"><button class="btn btn-primary" onclick="load_logs('+page_num_prev+')">Вперёд</button></div>';
			}
			if ( result.pages > 1 ) page_num += '<div class="pad_pagin"><button class="btn btn-primary">'+current_page+'</button></div>'; 
			if ( page_num_next < result.pages ) {
				page_num += '<div class="pad_pagin"><button class="btn btn-primary" onclick="load_logs('+page_num_next+')">Назад</button></div>';
				page_num += '<div class="pad_pagin"><button class="btn btn-primary" onclick="load_logs('+page_exit_next+')">'+page_exit_text+'</button></div>';
			}
			
			document.getElementById("pagin_logs_content_load").innerHTML = page_num;
			
		}
	}

	async function load_news( page_limit ) {
		let formData = new FormData();
		formData.append("page", page_limit);

		let response = await fetch('/administrative/loadnews/', {
			method: 'POST',
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(Object.fromEntries(formData))
		});

		let result = await response.json();

		if ( result.error ) {
			new a_toast({
				title: 'Ошибка',
				text: result.error,
				theme: 'danger',
				autohide: true,
				interval: 10000
			});
		} else {
			
			let mas_content_news = '<tr><th>Заголовок</th><th>Текст</th><th>Обложка</th><th width="20%">Управление</th></tr>';
			
			for (let key in result.data) {
				let item = result.data[key];
				mas_content_news += '<tr id="news_list_'+item._id+'"><td><a href="/news/'+item.url+'/" target="_blank">'+item.title+'</a></td><td>'+item.content_short+'</td><td><a href="/static/uploads/'+item.img+'" target="_blank">'+item.img+'</a></td><td><a href="/administrative/news-'+item.url+'/" target="_blank"><button class="btn btn-primary">Изменить</button></a> <button class="btn btn-danger" onclick="delete_news(\''+item._id+'\')">Удалить</button></td></tr>';
			}
			
			document.getElementById("news_content_load").innerHTML = mas_content_news;
			
			result.page = Number(result.page);
			result.pages = Number(result.pages);
			
			let page_num = '',
				page_num_next = 0,
				page_num_prev = 0,
				current_page = Number(result.page) + 1;
			
			page_num_next = Number(result.page)+1;
			page_num_prev = Number(result.page)-1;
			
			if ( result.page > 0 ) page_num += '<div class="pad_pagin"><button class="btn btn-primary" onclick="load_news('+page_num_prev+')">Вперёд</button></div>';
			if ( result.pages > 1 ) page_num += '<div class="pad_pagin"><button class="btn btn-primary">'+current_page+'</button></div>'; 
			if ( page_num_next < result.pages ) page_num += '<div class="pad_pagin"><button class="btn btn-primary" onclick="load_news('+page_num_next+')">Назад</button></div>';						
			
			document.getElementById("pagin_news_content_load").innerHTML = page_num;
			
		}
	}
	
	async function load_programming( page_limit ) {
		let formData = new FormData();
		formData.append("page", page_limit);

		let response = await fetch('/administrative/loadprogramming/', {
			method: 'POST',
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(Object.fromEntries(formData))
		});

		let result = await response.json();

		if ( result.error ) {
			new a_toast({
				title: 'Ошибка',
				text: result.error,
				theme: 'danger',
				autohide: true,
				interval: 10000
			});
		} else {
			
			let mas_content_programming = '<tr><th>Заголовок</th><th>Текст</th><th>Обложка</th><th width="20%">Управление</th></tr>';
			
			for (let key in result.data) {
				let item = result.data[key];
				mas_content_programming += '<tr id="programming_list_'+item._id+'"><td><a href="/programming/'+item.url+'/" target="_blank">'+item.title+'</a></td><td>'+item.content_short+'</td><td><a href="/static/cover/'+item.img+'" target="_blank">'+item.img+'</a></td><td><a href="/administrative/programming-'+item.url+'/" target="_blank"><button class="btn btn-primary">Изменить</button></a> <button class="btn btn-danger" onclick="delete_programming(\''+item._id+'\')">Удалить</button></td></tr>';
			}
			
			document.getElementById("programming_content_load").innerHTML = mas_content_programming;
			
			result.page = Number(result.page);
			result.pages = Number(result.pages);
			
			let page_num = '',
				page_num_next = 0,
				page_num_prev = 0,
				current_page = Number(result.page) + 1;
			
			page_num_next = Number(result.page)+1;
			page_num_prev = Number(result.page)-1;
			
			if ( result.page > 0 ) page_num += '<div class="pad_pagin"><button class="btn btn-primary" onclick="load_programming('+page_num_prev+')">Вперёд</button></div>';
			if ( result.pages > 1 ) page_num += '<div class="pad_pagin"><button class="btn btn-primary">'+current_page+'</button></div>'; 
			if ( page_num_next < result.pages ) page_num += '<div class="pad_pagin"><button class="btn btn-primary" onclick="load_programming('+page_num_next+')">Назад</button></div>';						
			
			document.getElementById("pagin_programming_content_load").innerHTML = page_num;
			
		}
	}
	
	async function load_settings() {
		let formData = new FormData();

		let response = await fetch('/administrative/loadsettings/', {
			method: 'POST',
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(Object.fromEntries(formData))
		});

		let result = await response.json();

		if ( result.error ) {
			new a_toast({
				title: 'Ошибка',
				text: result.error,
				theme: 'danger',
				autohide: true,
				interval: 10000
			});
		} else {
			
			document.getElementById("title_setting").value = result.data[0]['title'];
			document.getElementById("description_setting").value = result.data[0]['description'];
			document.getElementById("keys_setting").value = result.data[0]['keys'];
			
			let mas_content_setting = '<tr><th>Текущие настройки</th></tr>';
			
			for (let key in result.data) {
				let item = result.data[key];
				mas_content_setting += '<tr><td>Название: '+item.title+'</td></tr><tr><td>Описание: '+item.description+'</td></tr><tr><td>Ключевые слова: '+item.keys+'</td></tr><tr><td>Обложка: <a href="/static/uploads/'+item.img+'" target="_blank">'+item.img+'</a></td></tr><tr><td>Обновить карту сайта для поисковиков: <button type="button" class="btn btn-primary btn-sm" onclick="update_map()">Обновить</button></td></tr>';
			}
			
			document.getElementById("setting_content_load").innerHTML = mas_content_setting;
			
		}
	}

	title_news.oninput = function() {
		document.getElementById('url_news').value = translit(title_news.value);
	};
	
	title_programming.oninput = function() {
		document.getElementById('url_programming').value = translit(title_programming.value);
	};
	
	function translit(word){
		let converter = {
			'а': 'a',    'б': 'b',    'в': 'v',    'г': 'g',    'д': 'd',
			'е': 'e',    'ё': 'e',    'ж': 'zh',   'з': 'z',    'и': 'i',
			'й': 'y',    'к': 'k',    'л': 'l',    'м': 'm',    'н': 'n',
			'о': 'o',    'п': 'p',    'р': 'r',    'с': 's',    'т': 't',
			'у': 'u',    'ф': 'f',    'х': 'h',    'ц': 'c',    'ч': 'ch',
			'ш': 'sh',   'щ': 'sch',  'ь': '',     'ы': 'y',    'ъ': '',
			'э': 'e',    'ю': 'yu',   'я': 'ya'
		};
	 
		word = word.toLowerCase();
	  
		let answer = '';
		for (let i = 0; i < word.length; ++i ) {
			if (converter[word[i]] == undefined){
				answer += word[i];
			} else {
				answer += converter[word[i]];
			}
		}
	 
		answer = answer.replace(/[^-0-9a-z]/g, '-');
		answer = answer.replace(/[-]+/g, '-');
		answer = answer.replace(/^\-|-$/g, ''); 
		
		return answer;
		
	}
	
	async function delete_news( id_news ) {
		let formData = new FormData();
		formData.append("id_news", id_news);

		let response = await fetch('/administrative/deletenews/', {
			method: 'POST',
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(Object.fromEntries(formData))
		});

		let result = await response.json();

		if ( result.error ) {
			new a_toast({
				title: 'Ошибка',
				text: result.error,
				theme: 'danger',
				autohide: true,
				interval: 10000
			});
		} else {
			document.getElementById("news_list_"+id_news).style.display = "none";
			new a_toast({
				title: 'Успешно',
				text: 'Новость удалена',
				theme: 'success',
				autohide: true,
				interval: 10000
			});
		}
	}
	
	async function delete_programming( id_programming ) {
		let formData = new FormData();
		formData.append("id_programming", id_programming);

		let response = await fetch('/administrative/deleteprogramming/', {
			method: 'POST',
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(Object.fromEntries(formData))
		});

		let result = await response.json();

		if ( result.error ) {
			new a_toast({
				title: 'Ошибка',
				text: result.error,
				theme: 'danger',
				autohide: true,
				interval: 10000
			});
		} else {
			document.getElementById("programming_list_"+id_programming).style.display = "none";
			new a_toast({
				title: 'Успешно',
				text: 'Статья удалена',
				theme: 'success',
				autohide: true,
				interval: 10000
			});
		}
	}
	
	async function update_map() {
		let formData = new FormData();
		formData.append("id_map", 1);

		let response = await fetch('/administrative/upmap/', {
			method: 'POST',
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(Object.fromEntries(formData))
		});

		let result = await response.json();

		if ( result.error ) {
			new a_toast({
				title: 'Ошибка',
				text: result.error,
				theme: 'danger',
				autohide: true,
				interval: 10000
			});
		} else {
			new a_toast({
				title: 'Успешно',
				text: 'Sitemap обновлена',
				theme: 'success',
				autohide: true,
				interval: 10000
			});
		}
	}
	
	adminNews.onsubmit = async (e) => {
		e.preventDefault();

		let formData = new FormData(adminNews);

		if (document.getElementById('visibility_news').checked) {
			formData.set('visibility_news', 1);
		} else {
			formData.set('visibility_news', 0);
		}

		let response = await fetch('/administrative/addnews/', {
			method: 'POST',					
			body: formData
		});

		let result = await response.json();

		if ( result.error ) {
			new a_toast({
				title: 'Ошибка',
				text: result.error,
				theme: 'danger',
				autohide: true,
				interval: 10000
			});
		} else {	
			document.getElementById("adminNews").reset();	
			new a_toast({
				title: 'Успешно',
				text: 'Новость добавлена',
				theme: 'success',
				autohide: true,
				interval: 10000
			});			
			setTimeout(function() {load_news(0);}, 1000);
		}
	};
	
	adminProgramming.onsubmit = async (e) => {
		e.preventDefault();

		let formData = new FormData(adminProgramming);

		if (document.getElementById('visibility_programming').checked) {
			formData.set('visibility_programming', 1);
		} else {
			formData.set('visibility_programming', 0);
		}

		let response = await fetch('/administrative/addprogramming/', {
			method: 'POST',					
			body: formData
		});

		let result = await response.json();

		if ( result.error ) {
			new a_toast({
				title: 'Ошибка',
				text: result.error,
				theme: 'danger',
				autohide: true,
				interval: 10000
			});
		} else {	
			document.getElementById("adminProgramming").reset();	
			new a_toast({
				title: 'Успешно',
				text: 'Статья добавлена',
				theme: 'success',
				autohide: true,
				interval: 10000
			});			
			setTimeout(function() {load_programming(0);}, 1000);
		}
	};
	
	adminSettings.onsubmit = async (e) => {
		e.preventDefault();

		let formData = new FormData(adminSettings);

		let response = await fetch('/administrative/upsettings/', {
			method: 'POST',					
			body: formData
		});

		let result = await response.json();

		if ( result.error ) {
			new a_toast({
				title: 'Ошибка',
				text: result.error,
				theme: 'danger',
				autohide: true,
				interval: 10000
			});
		} else {	
			document.getElementById("adminSettings").reset();
			new a_toast({
				title: 'Успешно',
				text: 'Настройки обновлены',
				theme: 'success',
				autohide: true,
				interval: 10000
			});						
			setTimeout(function() {load_settings();}, 1000);
		}
	};
	
	adminNodeFiles.onsubmit = async (e) => {
		e.preventDefault();

		let formData = new FormData(adminNodeFiles);

		let response = await fetch('/administrative/loadfiles/', {
			method: 'POST',					
			body: formData
		});

		let result = await response.json();

		if ( result.error ) {
			new a_toast({
				title: 'Ошибка',
				text: result.error,
				theme: 'danger',
				autohide: true,
				interval: 10000
			});
		} else {	
			document.getElementById("adminNodeFiles").reset();	
			new a_toast({
				title: 'Успешно',
				text: 'Файлы загружены',
				theme: 'success',
				autohide: true,
				interval: 10000
			});			
			setTimeout(function() {load_files(0);}, 1000);
		}
	};
	
	async function load_files( page_limit ) {
		let formData = new FormData();
		formData.append("page", page_limit);

		let response = await fetch('/administrative/loadfileslist/', {
			method: 'POST',
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(Object.fromEntries(formData))
		});

		let result = await response.json();

		if ( result.error ) {
			new a_toast({
				title: 'Ошибка',
				text: result.error,
				theme: 'danger',
				autohide: true,
				interval: 10000
			});
		} else {
			
			let mas_content_files = '<tr><th>Файл</th><th width="20%">Управление</th></tr>';
			
			for (let key in result.data) {
				let item = result.data[key];
				mas_content_files += '<tr id="file_list_'+item._id+'"><td><a href="/static/files/'+item.title+'" target="_blank">'+item.title+'</a></td><td><button class="btn btn-danger" onclick="delete_files(\''+item._id+'\')">Удалить</button></td></tr>';
			}
			
			document.getElementById("files_content_load").innerHTML = mas_content_files;
			
			result.page = Number(result.page);
			result.pages = Number(result.pages);
			
			let page_num = '',
				page_num_next = 0,
				page_num_prev = 0,
				current_page = Number(result.page) + 1;
			
			page_num_next = Number(result.page)+1;
			page_num_prev = Number(result.page)-1;
			
			if ( result.page > 0 ) page_num += '<div class="pad_pagin"><button class="btn btn-primary" onclick="load_news('+page_num_prev+')">Вперёд</button></div>';
			if ( result.pages > 1 ) page_num += '<div class="pad_pagin"><button class="btn btn-primary">'+current_page+'</button></div>'; 
			if ( page_num_next < result.pages ) page_num += '<div class="pad_pagin"><button class="btn btn-primary" onclick="load_news('+page_num_next+')">Назад</button></div>';						
			
			document.getElementById("pagin_files_content_load").innerHTML = page_num;
			
		}
	}
	
	async function delete_files( id_files ) {
		let formData = new FormData();
		formData.append("id_files", id_files);

		let response = await fetch('/administrative/deletefiles/', {
			method: 'POST',
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(Object.fromEntries(formData))
		});

		let result = await response.json();

		if ( result.error ) {
			new a_toast({
				title: 'Ошибка',
				text: result.error,
				theme: 'danger',
				autohide: true,
				interval: 10000
			});
		} else {
			document.getElementById("file_list_"+id_files).style.display = "none";
			new a_toast({
				title: 'Успешно',
				text: 'Файл удалён',
				theme: 'success',
				autohide: true,
				interval: 10000
			});
		}
	}
	
	load_settings();
	load_news(0);
	load_programming(0);
	load_logs(0);
	load_files(0);