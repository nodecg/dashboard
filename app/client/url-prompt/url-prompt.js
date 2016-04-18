'use strict';

const ipcRenderer = require('electron').ipcRenderer;
const isUrl = require('is-url');
const input = document.getElementById('input');
const submit = document.getElementById('submit');
const message = document.getElementById('message');

input.addEventListener('change', clearError);
input.addEventListener('keydown', e => {
	// Enter key
	if (e.which === 13) {
		submitUrl();
	} else {
		clearError();
	}
});

submit.addEventListener('click', submitUrl);

function submitUrl() {
	const url = input.value;
	if (!isUrl(url)) {
		message.classList.add('error');
		message.innerText = 'Please enter a valid URL.';
		return;
	}

	ipcRenderer.sendSync('submitUrl', url);
}

function clearError() {
	if (message.classList.contains('error')) {
		message.classList.remove('error');
		message.innerText = '(Remember to include http/https or any necessary ports in your url.)';
	}
}
