async function load_programming( page_limit ) {
	let formData = new FormData();
	formData.append("page", page_limit);

	let response = await fetch('/programming/loadprogramming/', {
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
		
		let mas_content_programming = '';
		
		for (let key in result.data) {
			let item = result.data[key];				
			let newsdate = new Date(item.date_add);							
			mas_content_programming += '<div class="blog-list-single-item"><div class="content"><h2 class="title"><a href="/programming/'+item.url+'/" title="'+item.title+'">'+item.title+'</a></h2><p>'+item.content_short+'</p><div class="post-info"><span>'+newsdate.toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })+'</span></div></div></div>';
		}
		
		document.getElementById("load_programming_list").innerHTML = '<div class="blog-list-items-full-width">'+mas_content_programming+'</div>';
		
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
		
		window.scrollTo({
			top: 10,
			behavior: 'smooth',
		});

	}
}

load_programming(0);