/************** :SINAPSIS: ************/

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
			while(this.peso < config["COEF_SINAPSIS_UMBRAL_PESO"]){
				sinapsis.peso = Math.random()
			};
		}

		sinapsis.neurona_AxonEntrante = sinapsis.dendrita.neurona.red.neuronas[sinapsis.id];

		sinapsis.neurona_AxonEntrante.axon.sinapsis[sinapsis.dendrita.neurona.id] = sinapsis;

		sinapsis.dendrita.sinapsis[sinapsis.id] = sinapsis;


	}


	entrenar (valorEntrenamiento){


		this.peso += (this.neurona_AxonEntrante.valor - this.peso) * valorEntrenamiento * config["COEF_SINAPSIS_ENTRENAMIENTO"];
		
		if(this.peso < config["COEF_SINAPSIS_UMBRAL_PESO"]){
			this.kill();
			return;
		}
		if(this.peso > 1){
			this.peso = 1;
		}

		debugCheckValue(this.peso, [0,1]);
		
	}

	procesar (){
		this.valor =  1 - Math.abs(this.peso - this.neurona_AxonEntrante.valor);
		
		// this.valor =  this.peso * this.neurona_AxonEntrante.valor;
		debugCheckValue(this.valor, [0,1]);

		return this.valor
	}

	kill (){
		// removing from parent
		this.dendrita.delete_sinapsis(this.id);
	}

};
