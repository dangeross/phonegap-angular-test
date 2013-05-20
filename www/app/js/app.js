'use strict';

/* App Module */

angular.module('app', ['syncronizationServices', 'ioServices'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/home', {templateUrl: 'partials/home.html', controller: HomeController})
            .when('/login', {templateUrl: 'partials/login.html', controller: LoginController})
            .otherwise({redirectTo: '/home'});
    }])
    .run(['applicationSyncronizationService', function(applicationSyncronizationService) {
        applicationSyncronizationService.update(function() {
            console.log('Sync complete');
        });
    }]);

/* Phonegap Bootstrap loader */

document.addEventListener('deviceready', function() {
    angular.bootstrap(document, ['app']);
}, false);

