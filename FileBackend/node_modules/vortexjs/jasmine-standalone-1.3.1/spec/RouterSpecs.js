/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/

describe("Test de routers", function() { 
	describe("Un solo router", function() { 
		var un_router;
		beforeEach(function() {
			runs(function() { 
				un_router = new NodoRouter();   
			});          
		}); 
		it("Deberia poder publicar un filtro y recibir mensajes correctamente", function() {
			var mensaje_recibido = false;
			runs(function() { 
				un_router.when({p1:1}, function(msj){
					mensaje_recibido = true;
				});
				un_router.send({p1:1});
			});
			waits(0);        
			waitsFor(function() {
				return  mensaje_recibido;           
			}, "No recibi el mensaje", 500);
		});   
		it("Si envio un mensaje que no pedi no deberia recibirlo", function() {
			var mensaje_recibido = false;
			runs(function() { 
				un_router.when({p1:1}, function(msj){
					mensaje_recibido = true;
				});
				un_router.send({p1:2});
			});
			waits(50);        
			runs(function() {
			   expect(mensaje_recibido).toBeFalsy();
			});
		}); 
	});
	
	describe("Dos routers conectados", function() { 
		var un_router;
		var otro_router;
		beforeEach(function() {
			runs(function() { 
				un_router = new NodoRouter();   
				otro_router = new NodoRouter();
				un_router.conectarCon(otro_router);
			});          
		}); 
		it("Deberia poder publicar un filtro en un router y recibir correctamente los mensajes enviados desde el otro router", function() {
			var mensaje_recibido = false;
			runs(function() { 
				un_router.when({p1:1}, function(msj){
					mensaje_recibido = true;
				});
			});
			waits(50);  
			runs(function() { 
				otro_router.send({p1:1});
			});
			waits(0);        
			waitsFor(function() {
				return  mensaje_recibido;           
			}, "No recibi el mensaje", 500);
		});   
		it("Si envio un mensaje que nadie pidio no deberia recibirlo nadie", function() {
			var mensaje_recibido = false;
			runs(function() { 
				un_router.when({p1:1}, function(msj){
					mensaje_recibido = true;
				});
			});
			waits(50);       
			runs(function() { 
				otro_router.send({p1:2});
			});
			waits(50);        
			runs(function() {
			   expect(mensaje_recibido).toBeFalsy();
			});
		}); 
	});
	
	describe("cuatro routers conectados en estrella", function() { 
		var router_central;
		var router_periferico_1;
		var router_periferico_2;
		var router_periferico_3;
		beforeEach(function() {
			runs(function() { 
				router_central = new NodoRouter();   
				router_periferico_1 = new NodoRouter();
				router_periferico_2 = new NodoRouter();
				router_periferico_3 = new NodoRouter();
				router_central.conectarCon(router_periferico_1);
				router_central.conectarCon(router_periferico_2);
				router_central.conectarCon(router_periferico_3);
			});          
		}); 
		it("Un router debería recibir los filtros agregados del resto de la red", function() {
			runs(function() { 
				router_periferico_2.when({p1:1}, function(msj){	});
				router_periferico_3.when({p2:2}, function(msj){	});
			});
			waits(50);          
			runs(function() {
				var filtro_esperado = new FiltroOR([new FiltroXEjemplo({p1:1}), new FiltroXEjemplo({p2:2})]);
			   	expect(router_periferico_1.datosVecinos[0].filtroRecibido.equals(filtro_esperado)).toBeTruthy();
			});
		});   
	});
});