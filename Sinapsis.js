

/************** :SINAPSIS: ************/
var Sinapsis = function(opt){
	$.extend(this, {
		neurona: null, 		// container
		axon: null, 		//un Axon
		peso: null,			//peso
		valor: 0
	}, opt);
	
	this.start();
};

Sinapsis.prototype = {
	COEF_SINAPSIS_ENTRENAMIENTO: 0.5,
	start: function(){
		if(!this.peso){
			this.peso = Math.random();
		}
		
	},
	entrenar: function(valorEntrenamiento){
		var sinap = this;
		
		valorEntrenamiento = (valorEntrenamiento - 0.5);
		
		sinap.peso += (sinap.axon.valor - sinap.peso) * valorEntrenamiento * sinap.COEF_SINAPSIS_ENTRENAMIENTO;
		if(sinap.peso < 0){
			sinap.peso = 0.0;
		}		
	},
	procesar: function(){
		return this.valor = this.axon.valor * this.peso;
	}
	
};
