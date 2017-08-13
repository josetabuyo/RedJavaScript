/************************/

var Vortex = require('vortex-js');
var Vx = Vortex.Vx;

Vx.verbose = true;

//var server_vortex = new Vortex.ServerVortex();


Vx.conectarCon(new Vortex.NodoConectorSocket('http://localhost:3000'));
//Vx.conectarCon(new Vortex.NodoConectorSocket('https://router-vortex.herokuapp.com'));
console.log('Conectado a server Vortex en Heroku');



/************************/
var fs = require('fs');




/************************/
process.on('uncaughtException', function (err) {
  	console.log('Tiró error: ', err.toString());
	Vx.send({
		tipoDeMensaje: "vortex.debug.error",
		error: err.toString()
	});
});



/************************/
	
Vx.when({ 
	tipoDeMensaje: 'leerArchivo'
	
}, function(mensaje, response){
	
	
	fs.readFile(mensaje.path, 'utf-8', function(err, data){
		
		response.send({
			err: err,
			data: data
		});
		
	});
	
});



Vx.when({ 
	tipoDeMensaje: 'escribirArchivo'
	
}, function(mensaje, response){
	
	fs.appendFile(mensaje.path, mensaje.data, function(error){
		
		response.send({
			error: error,
			data: 'OK'
		});
		
	});
	
});

