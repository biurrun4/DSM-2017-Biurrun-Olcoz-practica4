var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);


app.set('view engine','jade');

app.use(express.static('public'));

// Almacenamos los nombres de los usuarios
var usernames = {};	

io.sockets.on('connection', function (socket) {

	// Cuando el cliente escribe algo
	socket.on('sendchat', function (data) {
		// Se lo mandamos de vuelta a él y al resto de sockets mediante 
		// la funcion local updatechat
		io.sockets.emit('updatechat', socket.username, data);
	});

	// Cuando se nos conecta un nuevo usuario
	socket.on('adduser', function(username){
		// Le asignamos al socket el nombre de usuario
		socket.username = username;
		// Almacenamos su nombre
		usernames[username] = username;
		// Informamos al usuario de su conexion
		socket.emit('updatechat', 'SERVER', 'you have connected');
		// Avisamos a todos los demás de que hay un nuevo usuario
		socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
		// Mandamos la nueva lista de usuarios
		io.sockets.emit('updateusers', usernames);
	});

	// Cuando alguien se desconecta
	socket.on('disconnect', function(){
		// borramos su nombre de la lista
		delete usernames[socket.username];
		// Actualizamos la lista de usuarios en los demás clientes
		io.sockets.emit('updateusers', usernames);
		// Secuencialmente anunciamos que el usuario se ha desconectado
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
	});
});



/*-------------------------------------
  VARIABLES DE CONTENIDO DE LA PAGINA
--------------------------------------*/

//Para las descripciones
var relleno = "Li Europan lingues es membres del sam familie. \
Lor separat existentie es un myth. Por scientie, musica, sport etc, \
 litot Europa usa li sam vocabular. Li lingues differe solmen in li grammatica";

//Datos relativos a camisetas
var camisetas = [
	{	imagen: "osasuna1.jpg",
			desc: "Camiseta 1.\n" + relleno},
	{	imagen: "paseo1.jpg",
			desc: "Camiseta 2.\n" + relleno},
	{	imagen: "osasunaverde1.jpg",
			desc: "Camiseta 3.\n" + relleno},
]

//Datos relativos a pantalonetas
var pantalonetas = [
	{	imagen: "pant1.jpg",
			desc: "Pantaloneta 1.\n" + relleno},
	{	imagen: "pant2.jpg",
			desc: "Pantaloneta 2.\n" + relleno},
	{	imagen: "pant3.jpg",
			desc: "Pantaloneta 3.\n" + relleno},
]

//Datos relativos a botas
var botas = [
	{	imagen: "botas1.png",
			desc: "Botas 1.\n" + relleno},
	{	imagen: "botas2.jpg",
			desc: "Botas 2.\n" + relleno},
	{	imagen: "botas3.jpg",
			desc: "Botas 3.\n" + relleno},
]

/*-------------------------------------
      GESTION DE PETICIONES POST
--------------------------------------*/

app.post('/camisetas/:id', function(request,response) {
		var imagen = camisetas[request.params.id].imagen
		console.log(imagen)
		var desc = camisetas[request.params.id].desc
		console.log(desc)
		if(!desc || !imagen){
			imagen = "notfound.jpg",
			desc = "No existe dicho producto"
		}
		var camiseta = {imagen: imagen, desc: desc};
		response.json(camiseta);
});

app.post('/pantalonetas/:id', function(request,response) {
		var imagen = pantalonetas[request.params.id].imagen
		console.log(imagen)
		var desc = pantalonetas[request.params.id].desc
		console.log(desc)
		if(!desc || !imagen){
			imagen = "notfound.jpg",
			desc = "No existe dicho producto"
		}
		var pantaloneta = {imagen: imagen, desc: desc};
		response.json(pantaloneta);
});

app.post('/botas/:id', function(request,response) {
		var imagen = botas[request.params.id].imagen
		console.log(imagen)
		var desc = botas[request.params.id].desc
		console.log(desc)
		if(!desc || !imagen){
			imagen = "notfound.jpg",
			desc = "No existe dicho producto"
		}
		var bota = {imagen: imagen, desc: desc};
		response.json(bota);
});


app.post('/:id',function(request,response){
	var categoria = request.params.id;
	console.log("Llamada " + categoria)
	console.log(categoria=='Botas');
	console.log(categoria!='Botas');
	if (categoria=='Botas'){
		var imagenes = getImagen(botas)
		console.log('Botas')
	} else if (categoria=='Pantalonetas') {
		var imagenes = getImagen(pantalonetas)
		console.log('Pantalonetas')
	} else {
		var imagenes = getImagen(camisetas)
		console.log('Camisetas')
	}

	console.log("envio:");
	console.log(imagenes);
	
	response.json(imagenes);
})

/*-------------------------------------
            FUNCION AUXILIAR
  Para conseguir un objeto que tenga
  unicamente las imagenes a mostrar
--------------------------------------*/

function getImagen(input) {
    var output = [];
    console.log("INPUT: ");
    console.log(input.length);
    for (var i=0; i < input.length; i++){
    	console.log("añadido "+i)
    	console.log(input[i].imagen)
        output.push(input[i].imagen);
    }
    return output;
}

/*-------------------------------------
            INICIO DEL SERVER
  Ponemos a funcionar el servidor en
  el puerto configurado o en el 8080
--------------------------------------*/

var port = process.env.PORT || 8080;
server.listen(port);