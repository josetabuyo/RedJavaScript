
/************** :SALIDA: ************/
var Salida = function(opt){
	$.extend(this, {
		red: null,
		box: {
			x0 	: null,
			y0 	: null,
			x1 	: null,
			y1 	: null
		},
		id: null,
		mapaNeuronaTarget: {}
	}, opt);
	
	if(!this.id){
		this.id = red.id;
	}
	
	this.start();
};

Salida.prototype = {
	start: function (){
		salida = this;
		//REORRO TODAS LAS NEURONAS DEL BOX
		for(var i = salida.box.x0; i <= salida.box.x1; i++){
			
			for(var j = salida.box.y0; j <= salida.box.y1; j++){
				var keyNeurona = salida.id + "x" + i + "y" + j;
				var neurona = red.neuronas[keyNeurona];
				
				salida.mapaNeuronaTarget[keyNeurona] = 1;
			}
		}
	}
};