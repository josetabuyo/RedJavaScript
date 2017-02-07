
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
	COEF_UMBRAL_SPIKE: 0.16,
	COEF_UMBRAL_SPIKE_MIN_TENSION: 0.2,
	COEF_TENSION_DECAIMIENTO: 0.1,
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
		
		if(neurona.dendritas.length > 0){
			return sumaValorDendritas / neurona.dendritas.length;
		}else{
			return 0
		}
	},
	activarExternal: function(valor){
		var neurona = this;
		
		neurona.red.bufferNeuronasProcess[neurona.id] = neurona;
		neurona.setTension(valor);
		
	},
				
	procesar: function(){
		var neurona = this;
		
		//neurona.setTension(neurona.procesarDendritas());
		
		/* DEBUG:
		* intentaré hacerle una pequeña 
		* derivada en la sumatoria para lograr así un filtro pasa altos,
		* para que no se quede siempre en la misma, que cambie!!!!
		*/
		var valorDendritas = neurona.procesarDendritas();
		
		var tensionAnterior = neurona.tensionSuperficial;
		
		var COEF_PID = 0.5;
		
		//neurona.setTension( (1-COEF_PID) * valorDendritas + COEF_PID * (valorDendritas - tensionAnterior) );
		neurona.setTension(valorDendritas);
		
		if(neurona.axon.valor>0){
			
			for(iDendrita in neurona.dendritas){
				var dendrita = neurona.dendritas[iDendrita];
				dendrita.entrenar();
			};
			
		}
		
	}
};
