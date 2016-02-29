
/************** :ENTRADA: ************/
var Entrada = function(opt){
	$.extend(this, {
		id: null,
		red: null,
		box: {
			x0 	: null,
			y0 	: null,
			x1 	: null,
			y1 	: null
		}
	}, opt);
	
	if(!this.id){
		this.id = Math.random();
	}
	
	this.start();
};

Entrada.prototype = {
	start: function (){
		var entrada = this;
		
		for(var i = entrada.box.x0; i <= entrada.box.x1; i++){
			for(var j = entrada.box.y0; j <= entrada.box.y1; j++){
				
				var keyNeurona = entrada.red.id + "x" + i + "y" + j;
				var neurona = entrada.red.neuronas[keyNeurona];
				neurona.tipo = "ENTRADA";
				neurona.procesar = null;
				neurona.dendritas = [];
				neurona.axon.activar = function(valor){
					this.__proto__.activar.call(this, valor);
					this.valorDepolarizacion = valor;
				};
				
			}
		}
	}
};