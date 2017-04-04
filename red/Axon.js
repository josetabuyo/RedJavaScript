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
	COEF_AXON_ANCHO_PULSO: 6,
	contAnchoPulsoHI: 0,
	contAnchoPulsoLO: 0,
	start: function (){
		var axon = this;
		//nada
	},
	activar: function(){
		var axon = this;
		
		
		
		if(axon.valor == 0 ){
			if(axon.contAnchoPulsoLO == 0){
				if(axon.neurona.tensionSuperficial > axon.neurona.COEF_UMBRAL_SPIKE){
					axon.valor = 1;
					axon.contAnchoPulsoHI = Math.round(axon.COEF_AXON_ANCHO_PULSO);
				}
			}else{
				axon.contAnchoPulsoLO--;
			}
		}else if(axon.valor == 1){
			axon.contAnchoPulsoHI--;
			
			if(axon.contAnchoPulsoHI == 0){
				axon.valor = 0;
				axon.contAnchoPulsoLO = Math.round(axon.COEF_AXON_ANCHO_PULSO);
			}
				
		}
		
	}
	
};