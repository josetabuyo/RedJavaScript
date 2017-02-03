/************************/

var Vortex = require('vortexjs');
var Vx = Vortex.Vx;

Vx.verbose = true;

var server_vortex = new Vortex.ServerVortex();

/************************/
var fs = require('fs');



/************************/
/*
var _ = require("./underscore-min");
var mongodb = require('mongodb');

var ObjectId = mongodb.ObjectID;
*/


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
	
	fs.writeFile(mensaje.path, mensaje.data, function(error){
		
		response.send({
			error: error,
			data: 'OK'
		});
		
	});
	
});








/*
//var uri = 'mongodb://127.0.0.1/Sime';
var uri = 'mongodb://admin:haciendo@ds033599.mongolab.com:33599/sime-backend';
mongodb.MongoClient.connect(uri, function(err, db) {  
  	if(err) throw err;
	var col_usuarios = db.collection('usuarios');
	var col_instrumentos = db.collection('instrumentos');
	var col_adaptadores = db.collection('adaptadores');
	var col_tipos_de_pieza = db.collection('tiposDePieza');
	var col_piezas = db.collection('piezas');
		
	Vx.when({
		tipoDeMensaje: 'medicionCruda'
	}, function(medicion_cruda){
        col_adaptadores.find({codigo: medicion_cruda.codigoAdaptador}).toArray(function(err, adaptadores){
            if(adaptadores.length == 0) return;
            var adaptador = adaptadores[0];
            col_instrumentos.find({idAdaptador: adaptador._id.toString()}).toArray(function(err, instrumentos){
                if(instrumentos.length == 0) return;
                var instrumento = instrumentos[0];
                Vx.send({
                    tipoDeMensaje: 'medicionAislada',
                    idInstrumento: instrumento._id.toString(),
                    valorMedicion: parseFloat(medicion_cruda.valorCrudo)    
                });
            });
        });		
	});
	
	Vx.when({ 
		tipoDeMensaje: 'usuarioLogin'
	}, function(login_msg, response){		
		col_usuarios.findOne({clavePublica:login_msg.clavePublica}, function(err, usuario){			
			if(usuario){
				col_instrumentos.find({idUsuarioOwner: usuario._id.toString()}).toArray(function(err, instrumentos){
					response.send({
						usuarioValido: true,
						apellido: usuario.apellido,
						nombre: usuario.nombre,
						nombreUsuario: usuario.nombreUsuario,
						idUsuario: usuario._id,
						instrumentos: _.map(instrumentos, function(inst){
							inst.idInstrumento = inst._id.toString();
        					delete inst._id;
        					delete inst.idAdaptador;
        					delete inst.idUsuarioOwner;
							return inst;
						})						
					});
				});
			} else{
				response.send({
					usuarioValido: false
				});
			}
		});
	});
	
	Vx.when({ 
		tipoDeMensaje: 'buscarTiposDePieza'
	}, function(busq_piezas, response){
		col_tipos_de_pieza.find({ descripcion: new RegExp(busq_piezas.textoBusqueda)}).toArray(function(err, tipos_de_pieza){
			tipos_de_pieza = _.map(tipos_de_pieza, function(tipo_de_pieza){ 
				tipo_de_pieza.idTipoDePieza = tipo_de_pieza._id.toString();
        		delete tipo_de_pieza._id;
				return tipo_de_pieza;
			});
			response.send({
				tiposDePieza: tipos_de_pieza
			});
		});
	});
	
	Vx.when({ 
		tipoDeMensaje: 'newPieza'
	}, function(msg, response){
		msg.pieza.mediciones = _.map(msg.pieza.mediciones, function(medicion){
			medicion.idUsuarioMedidor = msg.idUsuario;
			return medicion;
		});
		
		col_piezas.save(msg.pieza, function(err, pieza){
			if(err) {
				response.send({
					resultado: "error al agregar"
				});
				return;
			}	
			response.send({
				resultado: "ok",
				pieza:{
					idPieza: pieza._id.toString(),
					descripcion: "descripción mockeada, el id está bien"
				}
			});	
		});
	});
	
	Vx.when({ 
		tipoDeMensaje: 'updatePieza'
	}, function(msg, response){
		col_piezas.findOne({_id: new ObjectId(msg.pieza.idPieza)}, function(err, pieza){
			if(!pieza) {
				response.send({
					resultado: "pieza no encontrada"
				});	
				return;
			}
			pieza.mediciones = _.union(pieza.mediciones, _.map(msg.pieza.mediciones, function(m){
				m.idUsuarioMedidor = msg.idUsuario;
				return m;
			}));

			col_piezas.save(pieza, function(err){
				var resultado = "ok";
				if(err) throw resultado = "error al agregar";
				response.send({
					resultado: resultado
				});	
			});
		});	
	});
});
*/
