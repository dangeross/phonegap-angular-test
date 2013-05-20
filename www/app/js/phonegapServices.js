'use strict';

/* Phonegap Services */

var ioServices = angular.module('ioServices', []);

ioServices.factory('connectivityService', ['$timeout', function($timeout) {
	var _onConnectionChangeList = [];
	var _lastConnectionType = undefined;

	var _updateConnection = function() {
		if(_lastConnectionType !== navigator.connection.type) {
			_lastConnectionType = navigator.connection.type;

			for (var i = _onConnectionChangeList.length - 1; i >= 0; i--) {
				if(_onConnectionChangeList[i] !== undefined) {
					_onConnectionChangeList[i](_lastConnectionType);
				} else {
					_onConnectionChangeList.splice(i, 1);
				}
			}
		}

		$timeout(_updateConnection, 10000);
	};

	_updateConnection();

	console.log('Initialized connectivityService');

	return {
		onConnectionChange: function(onChangeCb) {
			if(typeof onChangeCb === 'function') {
				_onConnectionChangeList.push(onChangeCb);
			}
		},
		isOnline: function() {
			return (navigator.connection.type !== Connection.NONE);
		},
		isMobile: function() {
			return (navigator.connection.type === Connection.CELL || 
				navigator.connection.type === Connection.CELL_2G || 
				navigator.connection.type === Connection.CELL_3G || 
				navigator.connection.type === Connection.CELL_4G);
		}
	};
}]);

/**
 * File Storage Service
 * @return {object} Angular Service
 **/
ioServices.factory('storageService', function() {
	var _fileSystem = undefined;

	/**
	 * Initializes the local File System
	 * @param {function} onSuccessCb Successful operation callback
	 * @param {function} onErrorCb Error in operation callback
	 **/
	var _initFileSystem = function(onSuccessCb, onErrorCb) {
		if (_fileSystem === undefined) {
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
				_fileSystem = fs;
				onSuccessCb();
			}, onErrorCb);
		} else {
			onSuccessCb();
		};
	};

	/**
	 * A placeholder callback function in case one is not supplied
	 **/
	function _cb() {};

	console.log('Initialized storageService');

	return {
		exists: function(fileURI, onSuccessCb, onErrorCb) {
			onSuccessCb = onSuccessCb || _cb;
			onErrorCb = onErrorCb || _cb;

			// Initialize the file system
			_initFileSystem(function() {
				// Request the file entry
				_fileSystem.root.getFile(fileURI, {create: false}, onSuccessCb, onErrorCb);
			});			
		},
		read: function(fileURI, onSuccessCb, onErrorCb) {
			onSuccessCb = onSuccessCb || _cb;
			onErrorCb = onErrorCb || _cb;

			// Initialize the file system
			_initFileSystem(function() {
				// Request the file entry
				_fileSystem.root.getFile(fileURI, {create: false}, function(fileEntry) {
					// Request the file
					fileEntry.file(function(file) {
						// Read the file
						var _fileReader = new FileReader();
						_fileReader.onloadend = function() {
							onSuccessCb(_fileReader.result);
						};
						_fileReader.onerror = onErrorCb;
						_fileReader.readAsText(file);
					}, onErrorCb);
				}, onErrorCb);
			}, onErrorCb);
		},
		write: function(fileURI, content, onSuccessCb, onErrorCb) {
			onSuccessCb = onSuccessCb || _cb;
			onErrorCb = onErrorCb || _cb;

			_initFileSystem(function() {
				// Request the file entry
				_fileSystem.root.getFile(fileURI, {create: true}, function(fileEntry) {
					// Request the file
					fileEntry.createWriter(function(fileWriter) {
						// Write the file
						fileWriter.onwriteend = onSuccessCb;
						fileWriter.onerror = onErrorCb;
						fileWriter.write(content);
					}, onErrorCb);
				}, onErrorCb);
			}, onErrorCb);			
		},
		remove: function(fileURI, onSuccessCb, onErrorCb) {
			onSuccessCb = onSuccessCb || _cb;
			onErrorCb = onErrorCb || _cb;

			_initFileSystem(function() {
				// Request the file entry
				_fileSystem.root.getFile(fileURI, {create: false}, function(fileEntry) {
					fileEntry.remove(onSuccessCb, onErrorCb);
				}, onErrorCb);
			}, onErrorCb);
		}
	};
});