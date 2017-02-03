

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
	start: function(){
		if(!this.peso){
			this.peso = Math.random();
		}
		
	},
	procesar: function(){
		console.log('Sinapsis_procesar');
		var sinap = this;
		
		sinap.valor = sinap.axon.valor * sinap.peso;
		return sinap.valor;
	}
	
};
