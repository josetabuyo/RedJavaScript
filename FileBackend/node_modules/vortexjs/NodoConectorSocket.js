/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/

if(typeof(require) != "undefined"){
    var NodoNulo = require("./NodoNulo").clase;
	var io = require('socket.io');
}

var NodoConectorSocket = function(opt){
    this.socket = opt.socket||io.connect(opt);
    this.verbose = opt.verbose||false;
    this.id = opt.id||"anonimo";
    this.alDesconectar = opt.alDesconectar||function(){};
	this.vecino = new NodoNulo();
    var _this = this;
    this.socket.on('mensaje_vortex', function (mensaje) {
        if(_this.verbose) console.log("conector recibe mensaje por socket:", mensaje);
        _this.vecino.recibirMensaje(mensaje, _this);
    });
    this.socket.on('disconnect', function () {
        _this.desconectarDe(_this.vecino);
		
    });
    if(this.verbose) console.log('socket ' + this.id + ' conectado');
};

NodoConectorSocket.prototype.conectarCon = function(un_vecino){
	if(this.vecino === un_vecino) return;
    this.vecino = un_vecino;
	un_vecino.conectarCon(this);
};

NodoConectorSocket.prototype.desconectarDe = function(un_nodo){
    this.vecino = new NodoNulo();
    this.desconectarDe = function(){};
    
    un_nodo.desconectarDe(this);
    if(this.verbose) console.log('socket ' + this.id + ' desconectado');
    this.alDesconectar();
};

NodoConectorSocket.prototype.recibirMensaje = function(mensaje){  
    if(this.verbose) console.log("conector envia mensaje por socket:", mensaje);
    this.socket.emit('mensaje_vortex', mensaje);
};

if(typeof(require) != "undefined"){
    exports.clase = NodoConectorSocket;
}