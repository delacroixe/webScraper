


module.exports = function(io) {
	io.sockets.on('connection', function(socket){
		console.log("Client connected");

		socket.on('additem',function(item){
			console.log(item);
			console.log("recivido por server");
			socket.broadcast.emit('reciveItem', item);
		});

		socket.on('item',function(item){
			console.log(item);
		});

		socket.on('disconnect',function(){
			console.log("GAME OVER");
		});

	});
};


