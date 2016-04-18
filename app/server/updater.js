'use strict';

const os = require('os');
const {app, autoUpdater, ipcMain} = require('electron');
const {isDev, log} = require('./util');
const UPDATE_SERVER_HOST = 'nodecg-dashboard-nuts.herokuapp.com';

module.exports = function (mainWindow) {
	if (isDev) {
		return;
	}

	const version = app.getVersion();

	autoUpdater.addListener('update-available', () => {
		log('A new update is available');
	});

	autoUpdater.addListener('update-downloaded', (event, releaseNotes, releaseName) => {
		mainWindow.webContents.send('updateDownloaded', releaseName);
	});

	autoUpdater.addListener('error', error => {
		log(error);
	});

	autoUpdater.addListener('checking-for-update', () => {
		log('checking-for-update');
	});

	autoUpdater.addListener('update-not-available', () => {
		log('update-not-available');
	});

	autoUpdater.setFeedURL(`https://${UPDATE_SERVER_HOST}/update/${os.platform()}_${os.arch()}/${version}`);

	mainWindow.webContents.once('did-frame-finish-load', () => {
		autoUpdater.checkForUpdates();
	});

	ipcMain.on('installUpdateNow', () => {
		autoUpdater.quitAndInstall();
	});
};
