/************** :AXON: ************/
var Axon = function(opt){
	
	$.extend(this, {
		neurona: null,
		valor: 0,
		valorDepolarizacion: 0,
		id: null,
		sinapsis:{}
	},opt);
	
	//if(!this.id){
	//	this.id = Math.random();
	//}
	
	this.start();
	
};
Axon.prototype = {
	COEF_AXON_UMBRAL: 0.19,
	//COEF_AXON_UMBRAL: 0.19,
	start: function (){
		var axon = this;
		//nada
	},
	depolarizar: function(valor){
		var axon = this;
		
		axon.valorDepolarizacion = valor;
		
		if(axon.valorDepolarizacion > axon.COEF_AXON_UMBRAL){
			axon.activar(1);
			
		}else{
			axon.activar(0);
		}		
	},
	activar: function(valor){
		var axon = this;
		axon.valor = valor;
		
		for(clave in axon.sinapsis){
			var neuronaVecina = axon.sinapsis[clave].neurona;
			neuronaVecina.red.bufferNeuronasProcess[neuronaVecina.id] = neuronaVecina;
		}
	}
	
};