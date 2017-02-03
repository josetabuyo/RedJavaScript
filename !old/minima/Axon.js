/************** :AXON: ************/
var Axon = function(opt){
	
	$.extend(this, {
		valor: 0,
		//id: null, // DEBUG: solo para debug
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
	set: function(valor){
		var axon = this;
		
		axon.valor = valor;
		
		for(clave in axon.sinapsis){
			axon.sinapsis[clave].neurona.debeProcesar();
		}
		
		
	}
};