/************** :SINAPSIS: ************/
var COEF_SINAPSIS_ENTRENAMIENTO = 0.002;
var COEF_SINAPSIS_UMBRAL_PESO = 0.200;

class Sinapsis {
  constructor(opt) {

		$.extend(this, {
			dendrita: null,
			neurona_AxonEntrante: null,
			id: null,
			peso: null,
			valor: 0
		}, opt);


		var sinapsis = this;

		if(!sinapsis.peso){
			sinapsis.peso = Math.random();
			if(this.peso < COEF_SINAPSIS_UMBRAL_PESO){
				sinapsis.kill();
			}
		}

		sinapsis.neurona_AxonEntrante = sinapsis.dendrita.neurona.red.neuronas[sinapsis.id];

		sinapsis.neurona_AxonEntrante.axon.sinapsis[sinapsis.dendrita.neurona.id] = sinapsis;

		sinapsis.dendrita.sinapsis[sinapsis.id] = sinapsis;


	}


	entrenar (valorEntrenamiento){


		this.peso += (this.neurona_AxonEntrante.valor - this.peso) * valorEntrenamiento * COEF_SINAPSIS_ENTRENAMIENTO;


		if(this.peso < COEF_SINAPSIS_UMBRAL_PESO){
			this.kill();
			return;
		}

	}

	procesar (){
		this.valor = this.neurona_AxonEntrante.valor * this.peso;
		return this.valor
	}

	kill (){
		delete this.dendrita.sinapsis[this.id];
	}

};
