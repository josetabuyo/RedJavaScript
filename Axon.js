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
	COEF_AXON_UMBRAL: 0.5,
	start: function (){
		var axon = this;
		//nada
	},
	activar: function(){
		var axon = this;
		
		
		if(axon.neurona.tensionSuperficial > axon.COEF_AXON_UMBRAL){
			axon.valor = 1;
		}else{
			axon.valor = 0;
		}
			
		
		for(clave in axon.sinapsis){
			var neuronaVecina = axon.sinapsis[clave].neurona;
			neuronaVecina.red.bufferNeuronasProcess[neuronaVecina.id] = neuronaVecina;
		}
	}
	
};