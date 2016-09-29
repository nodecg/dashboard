'use strict';

const path = require('path');
const isDev = require('electron-is-dev');

let _log = function () {};

if (isDev) {
	_log = function (...args) {
		console.log(args);
	};
}

// Commented out until https://github.com/atom/node-nslog/issues/12 is resolved
/* else {
	const nsLog = require('nslog');
	_log = function (...args) {
		nsLog(args);
	};
} */

module.exports = {
	isDev,
	version: (function () {
		const packagePath = path.resolve(__dirname, '../package.json');
		return require(packagePath).version;
	})(),
	log(...args) {
		_log(args);
	}
};
