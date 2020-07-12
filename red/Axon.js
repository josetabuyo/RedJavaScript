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



		if(axon.valor == 0 ){
			axon.neurona.entrenar(-1);
			if(axon.contAnchoPulsoLO == 0){
				if(axon.neurona.tensionSuperficial > axon.COEF_AXON_UMBRAL_SPIKE){
					axon.arriba();
					axon.contAnchoPulsoHI = Math.round(axon.COEF_AXON_ANCHO_PULSO);
				}
			}else{
				axon.contAnchoPulsoLO--;
			}
		}else if(axon.valor == 1){
			axon.neurona.entrenar(1);

			axon.contAnchoPulsoHI--;

			if(axon.contAnchoPulsoHI == 0){
				axon.abajo();
				axon.contAnchoPulsoLO = Math.round(axon.COEF_AXON_ANCHO_PULSO);
			}

		}

	},
	arriba: function(){
		var axon = this;

		axon.valor = 1;

	},
	abajo: function(){
		var axon = this;

		axon.valor = 0;
	}
};
