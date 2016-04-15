'use strict';

const ipcRenderer = require('electron').ipcRenderer;

const webview = document.createElement('webview');
webview.setAttribute('allowpopups', true);
document.body.appendChild(webview);

ipcRenderer.send('loadMostRecentUrl');

let loadedUrl;
ipcRenderer.on('loadUrl', (event, url) => {
	if (loadedUrl === url) {
		console.log('not loading url into webview, already loaded:', url);
		return;
	}

	console.log('loading new url into webview:', url);
	webview.src = url;
	loadedUrl = url;
});
