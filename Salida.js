
/************** :SALIDA: ************/
var Salida = function(opt){
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

Salida.prototype = {
	start: function (){
		var salida = this;
		
		for(var i = salida.box.x0; i <= salida.box.x1; i++){
			for(var j = salida.box.y0; j <= salida.box.y1; j++){
				
				var keyNeurona = salida.red.id + "x" + i + "y" + j;
				var neurona = salida.red.neuronas[keyNeurona];
				neurona.tipo = "SALIDA";
				neurona.axon.sinapsis = {};
				
			}
		}
	}
};