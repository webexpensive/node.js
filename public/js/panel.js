adminLogin.onsubmit = async (e) => {
	e.preventDefault();

	let formData = new FormData(adminLogin);

	let response = await fetch('/administrative/login', {
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
		location.reload();
	}
};