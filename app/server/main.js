'use strict';

if (require('electron-squirrel-startup')) {
	return;
}

const path = require('path');
const {app, BrowserWindow, crashReporter} = require('electron');
const windowStateKeeper = require('electron-window-state');

require('electron-debug')({showDevTools: false});

// Report crashes to our server.
crashReporter.start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
	// Load the previous state with fallback to defaults
	const mainWindowState = windowStateKeeper({
		defaultWidth: 800,
		defaultHeight: 600
	});

	const packagePath = path.resolve(__dirname, '../package.json');
	const version = require(packagePath).version;

	// Create the browser window using the state information.
	mainWindow = new BrowserWindow({
		x: mainWindowState.x,
		y: mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height,
		minWidth: 350,
		minHeight: 375,
		useContentSize: true,
		resizable: true,
		frame: true,
		title: `NodeCG Dashboard v${version}`
	});

	// Quit when main window is closed.
	mainWindow.on('closed', () => app.quit());

	// Spin up the menu lib
	require('./menu')(mainWindow);

	// Spin up the autoupdader
	require('./updater')(mainWindow);

	// Let us register listeners on the window, so we can update the state
	// automatically (the listeners will be removed when the window is closed)
	// and restore the maximized or full screen state
	mainWindowState.manage(mainWindow);

	// and load the index.html of the app.
	const webviewPath = path.resolve(__dirname, '../client/main/main.html');
	mainWindow.loadURL(`file:///${webviewPath}`);
});
