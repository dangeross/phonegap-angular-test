'use strict';

var utilServices = angular.module('utilServices', []);

utilServices.factory('promiseService', ['$q', '$rootScope', function($q, $rootScope) {
	return {
		defer: function() {
			return $q.defer();
		},
		resolve: function(defer, response) {
			if (!$rootScope.$root.$$phase) {
				$rootScope.$apply(function() {
					defer.resolve(response);
				});
			} else {
				defer.resolve(response);
			}
		},
		reject: function(defer, response) {
			if (!$rootScope.$root.$$phase) {
				$rootScope.$apply(function() {
					defer.reject(response);
				});
			} else {
				defer.reject(response);
			}
		}
	};
}]);