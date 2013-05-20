'use strict';

/* Home Controller */

var HomeController = ['$scope', 'storageService', function($scope, storageService) {
	$scope.data = {
		title: 'phonegap',
		list: ['iPhone', 'iPod', 'iPad']
	};

	storageService.exists('text.txt').then(function(res) {
		console.log('Exists resolve: ' + res.file + '(' + res.exists + ')');

		storageService.write('text.txt', 'This is a test').then(function(res) {
			console.log('Write resolve: ' + res.file + '(' + res.write + ')');

			storageService.read('text.txt').then(function(res) {
				console.log('Read resolve: ' + res.file + '(' + res.read + '): ' + res.content);

				storageService.remove('text.txt').then(function(res) {
					console.log('Remove resolve: ' + res.file + '(' + res.remove + ')');
				}, function(res) {
					console.log('Remove reject: ' + res.err + '(' + res.msg + ')');
				});
			}, function(res) {
				console.log('Read reject: ' + res.err + '(' + res.msg + ')');
			});
		}, function(res) {
			console.log('Write reject: ' + res.err + '(' + res.msg + ')');
		});
	}, function(res) {
		console.log('Exists reject: ' + res.err + '(' + res.msg + ')');
		
		storageService.write('text.txt', 'This is a test').then(function(res) {
			console.log('Write resolve: ' + res.file + '(' + res.write + ')');

			storageService.read('text.txt').then(function(res) {
				console.log('Read resolve: ' + res.file + '(' + res.read + '): ' + res.content);

				storageService.remove('text.txt').then(function(res) {
					console.log('Remove resolve: ' + res.file + '(' + res.remove + ')');
				}, function(res) {
					console.log('Remove reject: ' + res.err + '(' + res.msg + ')');
				});
			}, function(res) {
				console.log('Read reject: ' + res.err + '(' + res.msg + ')');
			});
		}, function(res) {
			console.log('Write reject: ' + res.err + '(' + res.msg + ')');
		});
	});
}];

/* Login Controller */

var LoginController = ['$scope', function($scope) {

}];
