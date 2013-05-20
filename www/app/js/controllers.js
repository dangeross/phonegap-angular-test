'use strict';

/* Home Controller */

var HomeController = ['$scope', 'connectivityService', function($scope, connectivityService) {
	$scope.data = {
		title: 'phonegap',
		list: ['iPhone', 'iPod', 'iPad']
	};

	console.log('Online: ' + connectivityService.isOnline());
	
	connectivityService.onConnectionChange(function(type) {
		console.log('Connection now: ' + type);
	});

/*	storageService.exists('text.txt', function() {
		console.log('Exists');

		storageService.write('text.txt', 'This is a test', function() {
			console.log('Write success');

			storageService.read('text.txt', function(res) {
				console.log('Read success: '+res);

				storageService.remove('text.txt', function() {
					console.log('Remove success');
				}, function() {
					console.log('Remove fail');
				});
			}, function() {
				console.log('Write fail');

				storageService.remove('text.txt', function() {
					console.log('Remove success');
				}, function() {
					console.log('Remove fail');
				});
			});
		}, function() {
			console.log('Write fail');

			storageService.read('text.txt', function(res) {
				console.log('Read success: '+res);

				storageService.remove('text.txt', function() {
					console.log('Remove success');
				}, function() {
					console.log('Remove fail');
				});
			}, function() {
				console.log('Write fail');

				storageService.remove('text.txt', function() {
					console.log('Remove success');
				}, function() {
					console.log('Remove fail');
				});
			});
		});
	}, function() {
		console.log('Not exists');

		storageService.write('text.txt', 'This is a test', function() {
			console.log('Write success');

			storageService.read('text.txt', function(res) {
				console.log('Read success: '+res);

				storageService.remove('text.txt', function() {
					console.log('Remove success');
				}, function() {
					console.log('Remove fail');
				});
			}, function() {
				console.log('Write fail');

				storageService.remove('text.txt', function() {
					console.log('Remove success');
				}, function() {
					console.log('Remove fail');
				});
			});
		}, function() {
			console.log('Write fail');

			storageService.read('text.txt', function(res) {
				console.log('Read success: '+res);

				storageService.remove('text.txt', function() {
					console.log('Remove success');
				}, function() {
					console.log('Remove fail');
				});
			}, function() {
				console.log('Write fail');

				storageService.remove('text.txt', function() {
					console.log('Remove success');
				}, function() {
					console.log('Remove fail');
				});
			});
		});
	});*/
}];

/* Login Controller */

var LoginController = ['$scope', function($scope) {

}];
