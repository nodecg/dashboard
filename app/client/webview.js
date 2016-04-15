'use strict';

const ipcRenderer = require('electron').ipcRenderer;

const opening = document.getElementById('opening');
const openingUrl = document.getElementById('opening-url');

const webview = document.createElement('webview');
webview.setAttribute('allowpopups', true);

let revealTimeout;
webview.addEventListener('dom-ready', () => {
	clearTimeout(revealTimeout);
	revealTimeout = setTimeout(() => {
		opening.classList.add('hidden');
		webview.style.opacity = 1;
	}, 500);
});

document.body.appendChild(webview);

ipcRenderer.send('loadMostRecentUrl');

let loadedUrl;
ipcRenderer.on('loadUrl', (event, url) => {
	if (loadedUrl === url) {
		console.log('not loading url into webview, already loaded:', url);
		return;
	}

	console.log('loading new url into webview:', url);
	webview.style.opacity = 0;
	opening.classList.remove('hidden');
	openingUrl.innerText = url;
	webview.src = url;
	loadedUrl = url;
	document.title = `NodeCG Dashboard - ${url}`;
});
