/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/
var qs = require('querystring');
var NodoNulo = require("./NodoNulo").clase;

var NodoSesionHTTP = function(opt){
    this.idSesion = opt.id;
    this.verbose = opt.verbose||false;
    this.app = opt.app;
    this.tiempoDeVida = opt.tiempoDeVida||10000;
    this.alDesconectar = opt.alDesconectar||function(){};
    this.bandejaDeEntrada = [];
    this.mensajeParcial = "";
    var _this = this;
    
    this.app.post('/session/' + this.idSesion, function(request, response){       
        request.on('data', function (chunk) {
            _this.mensajeParcial += chunk.toString();
            _this.resetTiempoDevida();
        });
        request.on('end', function () {
            if(_this.mensajeParcial!=""){                    
                var mensajes_desde_el_cliente = JSON.parse(qs.parse(_this.mensajeParcial).mensajes_vortex).contenidos;
                for(var i=0; i<mensajes_desde_el_cliente.length; i++){
                    _this.recibirMensajePorHttp(mensajes_desde_el_cliente[i]);    
                }  
                _this.mensajeParcial = "";
            }
            var mensajes_para_el_cliente = _this.getMensajesRecibidos();  
            response.send(JSON.stringify({
                contenidos:mensajes_para_el_cliente,
                proximaEsperaMinima:0,
                proximaEsperaMaxima:this.tiempoDeVida
            }));
            _this.resetTiempoDevida();
        }); 
    });
    if(this.verbose) console.log("Conector HTTP server: " + this.idSesion + " conectado");
    this.resetTiempoDevida();
	
	this.vecino = new NodoNulo();
};

NodoSesionHTTP.prototype.resetTiempoDevida = function(){
    var _this = this;
    if(this.timeoutTiempoDevida) clearTimeout(this.timeoutTiempoDevida);
    this.timeoutTiempoDevida = setTimeout(function(){
        _this.desconectarDe(_this.vecino);
    }, this.tiempoDeVida);
};

NodoSesionHTTP.prototype.conectarCon = function(un_vecino){
    this.vecino = un_vecino;
};

NodoSesionHTTP.prototype.desconectarDe = function(un_nodo){
    this.vecino = new NodoNulo();
    this.desconectarDe = function(){};
    un_nodo.desconectarDe(this);
    if(this.verbose) console.log('Conector HTTP server: ' + this.idSesion + ' desconectado');
    this.alDesconectar();
};

NodoSesionHTTP.prototype.recibirMensaje = function(mensaje){
    if(this.verbose) console.log("mensaje recibido desde el router en sesion " + this.idSesion + " : " + JSON.stringify(mensaje));
    this.bandejaDeEntrada.push(mensaje);
};

NodoSesionHTTP.prototype.recibirMensajePorHttp = function(mensaje){
    if(this.verbose) console.log("mensaje recibido desde el cliente en sesion " + this.idSesion + " : " + JSON.stringify(mensaje));
    this.vecino.recibirMensaje(mensaje, this);
};

NodoSesionHTTP.prototype.getMensajesRecibidos = function(){
    var mensajesRecibidos = [];
    for(i=0;i<this.bandejaDeEntrada.length;i++){
        mensajesRecibidos.push(this.bandejaDeEntrada[i]);
    }
    this.bandejaDeEntrada = [];
    return mensajesRecibidos;
};

exports.clase = NodoSesionHTTP;