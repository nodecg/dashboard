'use strict';

const isDev = require('electron-is-dev');

let _log;

if (isDev) {
	_log = function (...args) {
		console.log(args);
	};
} else {
	const nsLog = require('nslog');
	_log = function (...args) {
		nsLog(args);
	};
}

module.exports = {
	isDev,
	log(...args) {
		_log(args);
	}
};
