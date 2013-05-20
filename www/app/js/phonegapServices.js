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
ioServices.factory('storageService', ['$q', '$rootScope', function($q, $rootScope) {
	var _fileSystem = undefined;
	var _errors = {
		noFileSystem: {err: 'NoFileSystem', msg: 'Could not initialize file system'},
		fileNotFound: {err: 'FileNotFound', msg: 'Could not find requested file'},
		fileNotReadable: {err: 'FileNotReadable', msg: 'Could not read from file'},
		fileNotWritable: {err: 'FileNotWritable', msg: 'Could not write to file'}
	};

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

	var _getFileEntry = function(fileURI, options) {
		var defer = $q.defer();

		// Initialize the file system
		_initFileSystem(function() {
			// Request the file entry
			_fileSystem.root.getFile(fileURI, options, function(fileEntry) {
				_resolvePromise(defer, fileEntry);
			}, function() {
				_rejectPromise(defer, _errors.fileNotFound);
			});
		}, function() {
			_rejectPromise(defer, _errors.noFileSystem);
		});

		return defer.promise;
	};

	var _resolvePromise = function(defer, response) {
		if (!$rootScope.$root.$$phase) {
			$rootScope.$apply(function() {
				defer.resolve(response);
			});
		} else {
			defer.resolve(response);
		}
	};

	var _rejectPromise = function(defer, response) {
		if (!$rootScope.$root.$$phase) {
			$rootScope.$apply(function() {
				defer.reject(response);
			});
		} else {
			defer.reject(response);
		}
	};

	console.log('Initialized storageService');

	return {
		/**
		 * Check if a file exists
		 * @param {string} fileURI The file to check
		 * @return {object} Promise for deferred result
		 **/
		exists: function(fileURI) {
			var defer = $q.defer();

			// Initialize & request the file entry
			_getFileEntry(fileURI, {create: false}).then(function(fileEntry) {
				_resolvePromise(defer, {
					exists: true,
					file: fileEntry.name
				});
			}, function(res) {
				_rejectPromise(defer, res);
			});

			return defer.promise;		
		},
		/**
		 * Read a file
		 * @param {string} fileURI The file to read
		 * @return {object} Promise for deferred result
		 **/
		read: function(fileURI) {
			var defer = $q.defer();

			// Initialize & request the file entry
			_getFileEntry(fileURI, {create: false}).then(function(fileEntry) {
				// Request the file
				fileEntry.file(function(file) {
					// Read the file
					var _fileReader = new FileReader();
					_fileReader.onloadend = function() {
						_resolvePromise(defer, {
							read: true, 
							file: fileEntry.name,
							content: _fileReader.result
						});
					};
					_fileReader.onerror = function() {
						_rejectPromise(defer, _errors.fileNotReadable);
					};

					_fileReader.readAsText(file);
				}, function() {
					_rejectPromise(defer, _errors.fileNotFound);
				});
			}, function(res) {
				_rejectPromise(defer, res);
			});

			return defer.promise;
		},
		/**
		 * Write a file
		 * @param {string} fileURI The file to write
		 * @param {string} content The content to write to file
		 * @return {object} Promise for deferred result
		 **/
		write: function(fileURI, content) {
			var defer = $q.defer();

			// Initialize & request the file entry
			_getFileEntry(fileURI, {create: true}).then(function(fileEntry) {
				// Request the file
				fileEntry.createWriter(function(fileWriter) {
					// Write the file
					fileWriter.onwriteend = function() {
						_resolvePromise(defer, {
							write: true,
							file: fileEntry.name
						});
					};
					fileWriter.onerror = function() {
						_rejectPromise(defer, _errors.fileNotWritable);
					};

					fileWriter.write(content);
				}, function() {
					_rejectPromise(defer, _errors.fileNotFound);
				});
			}, function(res) {
				_rejectPromise(defer, res);
			});

			return defer.promise;		
		},
		/**
		 * Remove a file
		 * @param {string} fileURI The file to remove
		 * @return {object} Promise for deferred result
		 **/
		remove: function(fileURI) {
			var defer = $q.defer();

			// Initialize & request the file entry
			_getFileEntry(fileURI, {create: false}).then(function(fileEntry) {
				fileEntry.remove(function() {
					_resolvePromise(defer, {
						remove: true,
						file: fileEntry.name
					});
				}, function() {
					_rejectPromise(defer, _errors.fileNotFound);
				});
			}, function(res) {
				_rejectPromise(defer, res);
			});

			return defer.promise;
		}
	};
}]);