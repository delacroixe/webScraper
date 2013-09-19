




 function realTime(io) {
	io.sockets.on('connection', function(socket){
		console.log(socket.id+' conectado');

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

	this.refresh = function(data){
		//console.log('dentro de REAL TIME');
		//console.log(data);
		io.sockets.emit('reciveItem', data);
	}

};

module.exports.realTime = realTime;


