/************** :AXON: ************/
var Axon = function(opt){

	$.extend(this, {
		neurona: null,
		valor: 0,
		id: null,
		sinapsis:{}
	},opt);

	this.start();

};
Axon.prototype = {
	COEF_AXON_ANCHO_PULSO: 4,
	COEF_AXON_UMBRAL_SPIKE: 0.05,
	contAnchoPulsoHI: 0,
	contAnchoPulsoLO: 0,
	start: function (){
		var axon = this;
		//nada
	},
	activar: function(){
		var axon = this;


		if(axon.neurona.tensionSuperficial > axon.COEF_AXON_UMBRAL_SPIKE){
			axon.valor = 1;
			axon.neurona.entrenar_positivas();
		}else{
			axon.valor = 0;
			axon.neurona.entrenar_negativas();
		}

	}
};
