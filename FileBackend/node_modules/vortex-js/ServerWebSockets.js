
var ServerWebSockets = function(server){
	var Vortex = require("./Vortex");
	var Vx = Vortex.Vx;

	var _this = this;
	var io = require('socket.io')(server, {
		'transports': ["websocket", "polling"]	  
	});
	var sesiones_web_socket = [];
	var ultimo_id_sesion_ws = 0;
	
	io.on('connection', function (socket) {
		var conector_socket = new Vortex.NodoConectorSocket({
			id: ultimo_id_sesion_ws.toString(),
			socket: socket, 
			//verbose: true, 
			alDesconectar:function(){
				sesiones_web_socket.splice(sesiones_web_socket.indexOf(conector_socket), 1);
			}
		});
		ultimo_id_sesion_ws+=1;
		sesiones_web_socket.push(conector_socket);
		Vx.conectarCon(conector_socket);
	});
};
exports.clase = ServerWebSockets;