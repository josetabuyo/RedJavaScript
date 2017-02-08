

/************** :SINAPSIS: ************/
var Sinapsis = function(opt){
	$.extend(this, {
		dendrita: null,
		neurona_AxonEntrante: null,
		peso: null,			//peso
		valor: 0
	}, opt);
	
	this.start();
};

Sinapsis.prototype = {
	COEF_SINAPSIS_ENTRENAMIENTO: 0,
	start: function(){
		var sinapsis = this;
		if(!sinapsis.peso){
			sinapsis.peso = Math.random();
			if(sinapsis.peso < sinapsis.dendrita.neurona.red.COEF_UMBRAL_SINAPSIS_PESO){
				sinapsis.kill();
			}
		}
		
	},
	entrenar: function(valorEntrenamiento){
		var sinapsis = this;
		
		valorEntrenamiento = (valorEntrenamiento - 0.5);
		
		sinapsis.peso += (sinapsis.neurona_AxonEntrante.axon.valor - sinapsis.peso) * valorEntrenamiento * sinapsis.COEF_SINAPSIS_ENTRENAMIENTO;
		if(sinapsis.peso < sinapsis.dendrita.neurona.red.COEF_UMBRAL_SINAPSIS_PESO){
			sinapsis.kill();
		}
	},
	procesar: function(){
		return this.valor = this.neurona_AxonEntrante.axon.valor * this.peso;
	},
	kill: function(){
		var sinapsis = this;
		delete sinapsis.dendrita.sinapsis[sinapsis.id];
	}
	
};
