'use strict';

/* Services */

var syncServices = angular.module('syncronizationServices', ['ioServices']);

/**
 * Syncronization Service
 * @return {object} Angular Service
 **/
syncServices.factory('applicationSyncronizationService', 
					 ['$http', 'connectivityService', 'storageService', 
					 function($http, connectivityService, storageService) {
	var _isRunning = false;
	var _updateCbList = [];

	var _updateCompleted = function(reloadNeeded) {
		_isRunning = false;

		for (var i = 0; i < _updateCbList.length; i++) {
			_updateCbList[i]();

			if (reloadNeeded === true) {
				window.location.reload();
			}
		}
	};

	console.log('Initialized applicationSyncronizationService');

	return {
		update: function(onSuccessCb) {
			_updateCbList.push(onSuccessCb);

			if (_isRunning === false) {
				if (connectivityService.isOnline()) {
					_isRunning = true;
				};
			}
		}
	};
}]);
