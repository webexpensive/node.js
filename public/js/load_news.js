async function load_news( page_limit ) {
	let formData = new FormData();
	formData.append("page", page_limit);

	let response = await fetch('/news/loadnews/', {
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
		
		let mas_content_news = '';
		
		for (let key in result.data) {
			let item = result.data[key];				
			let newsdate = new Date(item.date_add);							
			mas_content_news += '<div class="row gx-5 mb-3"><div class="col-md-6 mb-4"><div class="bg-image hover-overlay ripple shadow-2-strong rounded-5" data-mdb-ripple-color="light"><a href="/news/'+item.url+'/" title="'+item.title+'"><img src="/static/uploads/'+item.img+'" class="img-fluid" alt="'+item.title+'" title="'+item.title+'"></a></div></div><div class="col-md-6 mb-4"><small class="text-muted">'+newsdate.toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })+'</small><a class="news_feed_js" href="/news/'+item.url+'/" title="'+item.title+'"><h2><strong>'+item.title+'</strong></h2></a><p class="text-muted">'+item.content_short+'</p><a href="/news/'+item.url+'/" title="'+item.title+'"><button type="button" class="btn btn-primary">Подробнее</button></a></div></div>';
		}
		
		document.getElementById("load_news_list").innerHTML = mas_content_news;
		
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
		
		window.scrollTo({
			top: 10,
			behavior: 'smooth',
		});

	}
}

load_news(0);