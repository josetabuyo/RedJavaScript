

/************** :SINAPSIS: ************/
var Sinapsis = function(opt){
	$.extend(this, {
		dendrita: null,
		neurona_AxonEntrante: null,
		id: null,
		peso: null,			//peso
		valor: 0
	}, opt);

	this.start();
};

Sinapsis.prototype = {
	COEF_SINAPSIS_ENTRENAMIENTO: 0.002,
	COEF_SINAPSIS_ENTRENAMIENTO_DEFAULT: 0.002,
	COEF_SINAPSIS_UMBRAL_PESO: 0.200,
	start: function(){
		var sinapsis = this;

		if(!sinapsis.peso){
			sinapsis.peso = Math.random();
			if(this.peso < sinapsis.COEF_SINAPSIS_UMBRAL_PESO){
				sinapsis.kill();
			}
		}

		sinapsis.neurona_AxonEntrante = sinapsis.dendrita.neurona.red.neuronas[sinapsis.id];

		sinapsis.neurona_AxonEntrante.axon.sinapsis[sinapsis.dendrita.neurona.id] = sinapsis;

		sinapsis.dendrita.sinapsis[sinapsis.id] = sinapsis;



	},
	entrenar: function(valorEntrenamiento){


		this.peso += (this.neurona_AxonEntrante.axon.valor - this.peso) * valorEntrenamiento * this.COEF_SINAPSIS_ENTRENAMIENTO;


		if(this.peso < this.COEF_SINAPSIS_UMBRAL_PESO){
			this.kill();
			return;
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
