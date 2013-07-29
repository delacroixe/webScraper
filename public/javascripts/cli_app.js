var app = angular.module('app', []);

app.factory('socket', function($rootScope) {

	var socket = io.connect();

	socket.on('connect', function(){
		console.log('Conectado con el socket');
	});

	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},
		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if(callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	};
});

app.controller('MainCtrl', function($scope, socket) {
	$scope.items = [];

	var example = {
		titulo : "Pureba de titulo",
		entrada : "Esto es una prueba para visualizar la entrada"
	};

	$scope.items.push(example);

	// Incoming
	socket.on('reciveItem', function(data) {
		$scope.items.push(data);
	});

});