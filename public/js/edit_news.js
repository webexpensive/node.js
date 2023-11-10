let textarea = document.getElementById('text_news');
	sceditor.create(textarea, {
		format: 'bbcode',
		icons: 'monocons',
		style: '/static/minified/themes/content/default.min.css'
	});

	title_news.oninput = function() {
		document.getElementById('url_news').value = translit(title_news.value);
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
	
	adminNews.onsubmit = async (e) => {
		e.preventDefault();

		let formData = new FormData(adminNews);

		if (document.getElementById('visibility_news').checked) {
			formData.set('visibility_news', 1);
		} else {
			formData.set('visibility_news', 0);
		}

		let response = await fetch('/administrative/editnews/', {
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
			new a_toast({
				title: 'Успешно',
				text: 'Новость отредактирована',
				theme: 'success',
				autohide: true,
				interval: 10000
			});
		}
	};