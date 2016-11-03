

/************** :SINAPSIS: ************/
var Sinapsis = function(opt){
	$.extend(this, {
		neurona: null, 		//container
		dendrita: null,
		axon: null, 		//un Axon
		peso: null,			//peso
		valor: 0
	}, opt);
	
	this.start();
};

Sinapsis.prototype = {
	COEF_SINAPSIS_ENTRENAMIENTO: 0,
	start: function(){
		var self = this;
		if(!this.peso){
			this.peso = Math.random();
			if(self.peso < self.dendrita.neurona.red.COEF_UMBRAL_SINAPSIS_PESO){
				self.kill();
			}
		}
	},
	entrenar: function(valorEntrenamiento){
		var self = this;
		
		valorEntrenamiento = (valorEntrenamiento - 0.5);
		
		self.peso += (self.axon.valor - self.peso) * valorEntrenamiento * self.COEF_SINAPSIS_ENTRENAMIENTO;
		if(self.peso < self.dendrita.neurona.red.COEF_UMBRAL_SINAPSIS_PESO){
			self.kill();
		}
	},
	procesar: function(){
		return this.valor = this.axon.valor * this.peso;
	},
	kill: function(){
		var self = this;
		delete self.dendrita.sinapsis[self.id];
	}
	
};
