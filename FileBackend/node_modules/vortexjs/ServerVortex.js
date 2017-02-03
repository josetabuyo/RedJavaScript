var ServerVortex = function(app){
	var http = require("http");
    var url = require("url");
    var Vortex = require('vortexjs');
    var express = require('express');
    
    var app = express();
    var server = http.createServer(app);
    
	var Vx = Vortex.Vx;
	
	Vx.when({tipoDeMensaje:"Vortex.respuesta"}, function(){}); //atajo las respuestas para limpiar filtros
    var server_web_sockets = new Vortex.ServerWebSockets(server);
    var server_http = new Vortex.ServerHTTP(app);
    
    app.get('/infoSesiones', function(request, response){
        var info_sesiones = {
            http: sesiones_http.length,
            webSocket: sesiones_web_socket.length,
            router: router._patas.length
        };
        response.send(JSON.stringify(info_sesiones));
    });
    
    var puerto = process.env.PORT || 3000;
    server.listen(puerto);    
    
    console.log('Servidor vortex escuchando en puerto ' + puerto);
};
exports.clase = ServerVortex;