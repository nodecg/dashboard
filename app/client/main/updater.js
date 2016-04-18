(function () {
	'use strict';

	const ipcRenderer = require('electron').ipcRenderer;
	const update = document.getElementById('update');
	const updateLabel = document.getElementById('update-label');
	const updateNow = document.getElementById('update-now');
	const updateLater = document.getElementById('update-later');

	ipcRenderer.on('updateDownloaded', (event, releaseName) => {
		updateLabel.innerText = `A new version (${releaseName}) is ready to install.`;
		update.style.display = 'flex';
	});

	updateNow.addEventListener('click', () => {
		ipcRenderer.send('installUpdateNow');
	});

	updateLater.addEventListener('click', () => {
		update.style.display = 'none';
	});
})();
