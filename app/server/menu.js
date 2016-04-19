'use strict';

const fs = require('fs');
const path = require('path');
const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const {log} = require('./util');

const URL_PROMPT_WIDTH = 538;
const URL_PROMPT_HEIGHT = 154;
const userDataPath = app.getPath('userData');
const recentPath = path.join(userDataPath, 'recentUrls.json');
const recentUrls = (function () {
	if (fs.existsSync(recentPath)) {
		try {
			return JSON.parse(fs.readFileSync(recentPath, 'utf-8'));
		} catch (e) {
			log(e);
			return [];
		}
	}

	return [];
})();

let urlPromptWindow;
let mainWindow;

module.exports = function (mw) {
	mainWindow = mw;

	ipcMain.on('loadMostRecentUrl', () => {
		if (recentUrls.length > 0) {
			mainWindow.webContents.send('loadUrl', recentUrls.reduce((previousValue, currentValue) => {
				if (!previousValue) {
					return currentValue;
				}

				if (currentValue.lastUpdated > previousValue.lastUpdated) {
					return currentValue;
				}

				return previousValue;
			}).url);
		}
	});

	regenerateMenu();
};

function regenerateMenu() {
	const fileTemplate = {
		label: 'File',
		submenu: [
			{
				label: 'Open...',
				click() {
					// Calculate the position of the urlPromptWindow.
					// It will appear in the center of the mainWindow.
					const mainWindowPosition = mainWindow.getPosition();
					const mainWindowSize = mainWindow.getSize();
					const x = Math.round(mainWindowPosition[0] + mainWindowSize[0] / 2 - URL_PROMPT_WIDTH / 2);
					const y = Math.round(mainWindowPosition[1] + mainWindowSize[1] / 2 - URL_PROMPT_HEIGHT / 2);

					// If the urlPromptWindow is already open, focus and re-center it.
					if (urlPromptWindow) {
						urlPromptWindow.focus();
						urlPromptWindow.setPosition(x, y);
						return;
					}

					urlPromptWindow = new BrowserWindow({
						x,
						y,
						width: URL_PROMPT_WIDTH,
						height: URL_PROMPT_HEIGHT,
						useContentSize: true,
						resizable: true,
						fullscreen: false,
						fullscreenable: false,
						frame: true,
						minimizable: false,
						maximizable: false,
						autoHideMenuBar: true,
						title: 'New Dashboard'
					});

					urlPromptWindow.on('closed', () => {
						urlPromptWindow = null;
					});

					ipcMain.on('submitUrl', (event, url) => {
						let recentUrl = recentUrls.find(r => r.url === url);
						if (!recentUrl) {
							recentUrl = {url};
							recentUrls.push(recentUrl);

							if (recentUrls.length > 10) {
								recentUrls.length = 10;
							}
						}
						recentUrl.lastOpened = Date.now();
						sortRecentUrls();

						try {
							fs.writeFileSync(recentPath, JSON.stringify(recentUrls), 'utf-8');
						} catch (e) {
							log(e);
						}

						mainWindow.webContents.send('loadUrl', url);

						if (urlPromptWindow) {
							urlPromptWindow.close();
						}

						regenerateMenu();
					});

					// Remove the menu from the urlPromptWindow.
					urlPromptWindow.setMenu(null);

					const promptPath = path.resolve(__dirname, '../client/url-prompt/url-prompt.html');
					urlPromptWindow.loadURL(`file:///${promptPath}`);
				}
			},
			{
				label: 'Open Recent',
				submenu: recentUrls.map((r, index) => {
					return {
						label: r.url,
						click() {
							mainWindow.webContents.send('loadUrl', r.url);
							recentUrls[index].lastUpdated = Date.now();
							sortRecentUrls();
							regenerateMenu();
						}
					};
				})
			}
		]
	};

	const viewTemplate = {
		label: 'View',
		submenu: [
			{
				label: 'Reload',
				accelerator: 'CmdOrCtrl+R',
				click(item, focusedWindow) {
					if (focusedWindow) {
						focusedWindow.reload();
					}
				}
			},
			{
				label: 'Toggle Full Screen',
				accelerator: (function () {
					if (process.platform === 'darwin') {
						return 'Ctrl+Command+F';
					}

					return 'F11';
				})(),
				click(item, focusedWindow) {
					if (focusedWindow) {
						focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
					}
				}
			},
			{
				label: 'Toggle Developer Tools',
				accelerator: (function () {
					if (process.platform === 'darwin') {
						return 'Alt+Command+I';
					}

					return 'Ctrl+Shift+I';
				})(),
				click(item, focusedWindow) {
					if (focusedWindow) {
						focusedWindow.toggleDevTools();
					}
				}
			}
		]
	};

	const windowTemplate = {
		label: 'Window',
		role: 'window',
		submenu: [
			{
				label: 'Minimize',
				accelerator: 'CmdOrCtrl+M',
				role: 'minimize'
			},
			{
				label: 'Close',
				accelerator: 'CmdOrCtrl+W',
				role: 'close'
			}
		]
	};

	const template = [fileTemplate, viewTemplate, windowTemplate];

	// Add Mac-specific menu items
	if (process.platform === 'darwin') {
		const name = app.getName();
		template.unshift({
			label: name,
			submenu: [
				{
					label: `About ${name}`,
					role: 'about'
				},
				{
					type: 'separator'
				},
				{
					label: 'Services',
					role: 'services',
					submenu: []
				},
				{
					type: 'separator'
				},
				{
					label: `Hide ${name}`,
					accelerator: 'Command+H',
					role: 'hide'
				},
				{
					label: 'Hide Others',
					accelerator: 'Command+Alt+H',
					role: 'hideothers'
				},
				{
					label: 'Show All',
					role: 'unhide'
				},
				{
					type: 'separator'
				},
				{
					label: 'Quit',
					accelerator: 'Command+Q',
					click() {
						app.quit();
					}
				}
			]
		});

		windowTemplate.submenu.push(
			{
				type: 'separator'
			},
			{
				label: 'Bring All to Front',
				role: 'front'
			}
		);
	}

	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
}

function sortRecentUrls() {
	recentUrls.sort((a, b) => {
		return b.lastOpened - a.lastOpened;
	});
}
