
/************** :NEURONA: ************/
var Neurona = function(opt){
	$.extend(this, {
		red: null,		// container
		axon: null,
		tipo: "INTERNA",
		id: null,
		dendritas: [],
		tensionSuperficial: 0
		
	}, opt);
	
	this.start();
};

Neurona.prototype = {
	COEF_UMBRAL_SPIKE: 0.024,
	COEF_UMBRAL_SPIKE_MIN_TENSION: 0.2,
	COEF_TENSION_DECAIMIENTO: 0.200,
	start: function(){
		var neurona = this;
		
		this.axon = new Axon($.extend({},
			neurona.axon,
			{
				neurona: neurona,
				id: neurona.id
			}
		));
		
	},
	setTension: function(tensionSuperficial){
		var neurona = this;

		
		tensionSuperficial -= tensionSuperficial * neurona.COEF_TENSION_DECAIMIENTO;
		
		
		//Se normaliza la tensión superficial
		if(tensionSuperficial < 0){
			neurona.tensionSuperficial = 0;
		}else if(tensionSuperficial > 1.0){
			neurona.tensionSuperficial = 1.0;
		}else{
			neurona.tensionSuperficial = tensionSuperficial;
		}
		
	},
	procesarDendritas: function(){
		var neurona = this;
		
		var sumaValorDendritas = 0.0;
		
		for(iDendrita in neurona.dendritas){
			var dendrita = neurona.dendritas[iDendrita];
			
			dendrita.procesar();
			
			sumaValorDendritas += dendrita.valor;
			
		};
		
		if(neurona.dendritas.length > 0){
			return sumaValorDendritas / neurona.dendritas.length;
		}else{
			return 0
		}
	},
	activarExternal: function(valor){
		var neurona = this;
		
		neurona.setTension(valor);
		neurona.axon.activar();
		
	},
	procesar: function(){
		var neurona = this;
		
		var valorDendritas = neurona.procesarDendritas();
		
		neurona.setTension(valorDendritas);
		neurona.axon.activar();
		
		
		if(neurona.axon.valor>0){
			
			for(iDendrita in neurona.dendritas){
				var dendrita = neurona.dendritas[iDendrita];
				dendrita.entrenar();
			};
			
		}
		
	}
};
