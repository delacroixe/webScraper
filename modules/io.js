module.exports = function(io) {
	io.sockets.on('connection', function(socket){
		console.log("Client connected");

		socket.on('set_nickname', function(nickname, callback){
			console.log('Intentando poner el nick= ' + nickname);



		});

		socket.on('message',function(message){
			console.log("Mensajeeee!");
		});

		socket.on('disconnect',function(){
			console.log("GAME OVER");
		});

	});


	var sendMessage = function(message){
		io.sockets.emit('message', message);
	};
};