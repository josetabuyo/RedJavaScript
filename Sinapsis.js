

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
	entrenar: function(valorActivacionDendrita){
		var sinap = this;
		
		sinap.peso += (sinap.axon.valor - sinap.peso) * valorActivacionDendrita * sinap.COEF_SINAPSIS_ENTRENAMIENTO;
		
	},
	procesar: function(){
		return this.valor = this.axon.valor * this.peso;
	}
	
};
