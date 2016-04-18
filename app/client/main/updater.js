(function () {
	'use strict';

	const ipcRenderer = require('electron').ipcRenderer;
	const update = document.getElementById('update');
	const updateReleaseName = document.getElementById('update-releaseName');
	const updateNow = document.getElementById('update-now');
	const updateLater = document.getElementById('update-later');

	ipcRenderer.on('updateDownloaded', (event, releaseName) => {
		updateReleaseName.innerText = releaseName;
		update.style.display = 'flex';
	});

	updateNow.addEventListener('click', () => {
		ipcRenderer.send('installUpdateNow');
	});

	updateLater.addEventListener('click', () => {
		update.style.display = 'none';
	});
})();
