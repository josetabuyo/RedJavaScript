/************** :AXON: ************/
var Axon = function(opt){

	$.extend(this, {
		neurona: null,
		sinapsis:{}
	},opt);

	this.start();

};
Axon.prototype = {
	COEF_AXON_ANCHO_PULSO: 4,
	COEF_AXON_UMBRAL_SPIKE: 0.005,
	contAnchoPulsoHI: 0,
	contAnchoPulsoLO: 0,
	start: function (){
		var axon = this;
	},
};
