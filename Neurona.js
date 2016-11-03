
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
	
	if(!this.id){
		this.id = "N" + Math.random();
	}
	
	this.start();
};

Neurona.prototype = {
	COEF_UMBRAL_SPIKE: 0.8,
	COEF_UMBRAL_SPIKE_MIN_TENSION: 0.2,
	COEF_TENSION_DECAIMIENTO: 0.1,
	start: function(){
		var neurona = this;
		
		this.axon = new Axon({
			neurona: neurona,
			id: neurona.id
		});
		
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
		
		neurona.axon.activar();
	},
	procesarDendritas: function(){
		var neurona = this;
		
		var sumaValorDendritas = 0.0;
		
		for(iDendrita in neurona.dendritas){
			var dendrita = neurona.dendritas[iDendrita];
			
			dendrita.procesar();
			
			sumaValorDendritas += dendrita.valor;
			
		};
	
		return sumaValorDendritas / neurona.dendritas.length;
	},
	activarExternal: function(valor){
		var neurona = this;
		
		neurona.red.bufferNeuronasProcess[neurona.id] = neurona;
		neurona.setTension(valor);
		
	},
				
	procesar: function(){
		var neurona = this;
		
		neurona.setTension(neurona.procesarDendritas());
		
		if(neurona.axon.valor>0){
			
			for(iDendrita in neurona.dendritas){
				var dendrita = neurona.dendritas[iDendrita];
				dendrita.entrenar();
			};
			
		}
		
	}
};
