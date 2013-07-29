var socket = io.connect();

socket.on('connect', function(){
	console.log('Conectado con el socket');
});

$('#sendsoc').on('click', function(event) {
  event.preventDefault();

  var item = {
  	titulo: $('#titulo').val(),
    entrada: $('#entrada').val(),
    texto: $('#texto').val(),
    foto: $('#foto').val(),
    pie: $('#pie').val()
  };

  socket.emit('additem', item);

  	$('#titulo').val(''),
    $('#entrada').val(''),
    $('#texto').val(''),
    $('#foto').val(''),
    $('#pie').val('')


  alert("Noticia enviada");
});