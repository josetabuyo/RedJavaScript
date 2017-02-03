/************** :AXON: ************/
var Axon = function(opt){
	
	$.extend(this, {
		neurona: null,
		valor: 0,
		id: null,
		sinapsis:{}
	},opt);
	
	//if(!this.id){
	//	this.id = Math.random();
	//}
	
	this.start();
	
};
Axon.prototype = {
	
	start: function (){
		var axon = this;
		//nada
	},
	activar: function(){
		var axon = this;
		
		if(axon.neurona.tensionSuperficial > axon.neurona.COEF_UMBRAL_SPIKE){
			axon.valor = 1;
		}else if(axon.neurona.tensionSuperficial < axon.neurona.COEF_UMBRAL_SPIKE_MIN_TENSION){
			axon.valor = 0;
		}
		
		for(clave in axon.sinapsis){
			var neuronaVecina = axon.sinapsis[clave].dendrita.neurona;
			try{
				neuronaVecina.red.bufferNeuronasProcess[neuronaVecina.id] = neuronaVecina;
			}catch(e){
				debugger;
			}
		}
	}
	
};