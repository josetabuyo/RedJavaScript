/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/

if(typeof(require) != "undefined"){
    var NodoNulo = require("./NodoNulo").clase;
}

var NodoClienteHTTP = function (url, intervalo_polling, verbose, mensajes_por_paquete) {
    this.url = url;
    this.intervalo_polling = (intervalo_polling === undefined) ? 1500 : intervalo_polling;
    this.verbose = verbose || false;
    this.mensajes_por_paquete = mensajes_por_paquete || 100;
    this.start();
};

NodoClienteHTTP.prototype.start = function () {
    this.intervaloPedidoIdSesion = 5000;
    this.bandejaSalida = [];
    //arranca con un vecino que no hace nada
    this.vecino = new NodoNulo();

    //pido sesi�n
    this.pedirIdSesion();
};

NodoClienteHTTP.prototype.pedirIdSesion = function() {
    var _this = this;
    $.ajax({
        type: "POST",
        url: _this.url + '/create',
        xhrFields: {
            withCredentials: false
        },
        success: function (responseData, textStatus, jqXHR) {
            _this.idSesion = responseData;
            if (_this.verbose) console.log("idSesion:", _this.idSesion);
            setTimeout(function(){_this.enviarYRecibirMensajes();}, _this.intervaloPolling);
        },

        error: function (request, error) {
            console.log("errorAlPedirSesion:", error);
            setTimeout(function () { _this.pedirIdSesion(); }, _this.intervaloPedidoIdSesion);
        }
    });
}

NodoClienteHTTP.prototype.enviarYRecibirMensajes = function () {
    var _this = this;
    var cant_mensajes_a_enviar;
    var bandejaSalidaAux = [];

    cant_mensajes_a_enviar = this.bandejaSalida.length;
    if (cant_mensajes_a_enviar >= this.mensajes_por_paquete) cant_mensajes_a_enviar = this.mensajes_por_paquete;

    bandejaSalidaAux = this.bandejaSalida.splice(0, cant_mensajes_a_enviar);

    var datosSalida = {
        "contenidos": bandejaSalidaAux,
        "proximaEsperaMinima": 0,
        "proximaEsperaMaxima": 300000
    };
    if (bandejaSalidaAux.length > 0) {
        if (_this.verbose) console.log("enviando:", bandejaSalidaAux);
    }
    $.ajax({
        type: "POST",
        url: _this.url + '/session/' + _this.idSesion,
        xhrFields: {
            withCredentials: false
        },
        data: {
            mensajes_vortex: JSON.stringify(datosSalida)
        },
        success: function (responseData, textStatus, jqXHR) {
            var mensajesRecibidos = $.parseJSON(responseData).contenidos;

            mensajesRecibidos.forEach(function (element, index, array) {
                if (_this.verbose) console.log("mensaje recibido:", element);
                _this.vecino.recibirMensaje(element, _this);
            });

            setTimeout(function () {
                _this.enviarYRecibirMensajes();
            }, _this.intervaloPolling);
        },

        error: function (request, error) {
            console.log("error Al Enviar/Recibir Mensajes:", error);
            setTimeout(function () { _this.pedirIdSesion(); }, _this.intervaloPedidoIdSesion);
            _this.bandejaSalida = bandejaSalidaAux.concat(_this.bandejaSalida);
        }
    });
};

NodoClienteHTTP.prototype.recibirMensaje = function (un_mensaje) {
    this.bandejaSalida.push(un_mensaje);
};

NodoClienteHTTP.prototype.conectarCon = function (un_vecino) {
    if(this.vecino === un_vecino) return;
    this.vecino = un_vecino;
	un_vecino.conectarCon(this);
};


if(typeof(require) != "undefined"){
    exports.clase = NodoClienteHTTP;
}