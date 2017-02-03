/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/

if(typeof(require) != "undefined"){
	var NodoRouter = require("./NodoRouter").clase;
   	exports.Filtros = require("./Filtros");
    exports.NodoRouter = NodoRouter;
    exports.NodoConectorSocket = require("./NodoConectorSocket").clase;    
    exports.NodoSesionHTTP = require("./NodoSesionHTTP").clase;   
    exports.ServerHTTP = require("./ServerHTTP").clase;   
    exports.ServerWebSockets = require("./ServerWebSockets").clase;   
    exports.ServerVortex = require("./ServerVortex").clase;   
}

var Vx = new NodoRouter(); 

if(typeof(require) != "undefined"){	
	exports.Vx = Vx;
}