

/************** :SINAPSIS: ************/
var Sinapsis = function(opt){
	$.extend(this, {
		neurona: null, 		// container
		axon: null, 		//un Axon
		peso: null,			//peso
		valor: 0,
		COEF_SINAPSIS_ENTRENAMIENTO: 0.1
	}, opt);
	
	this.start();
};

Sinapsis.prototype = {
	start: function(){
		if(!this.peso){
			this.peso = Math.random();
		}
		
	},
	entrenar: function(valorEntrenamiento){
		var sinap = this;
		
		sinap.peso += (sinap.axon.valor - sinap.peso) * valorEntrenamiento * sinap.COEF_SINAPSIS_ENTRENAMIENTO;
		
	},
	procesar: function(){
		return this.valor = this.axon.valor * this.peso;
	}
	
};
