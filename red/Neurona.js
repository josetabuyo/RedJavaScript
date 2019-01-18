
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

		
		//Se normaliza la tensión superficial
		if(tensionSuperficial < 0){
			neurona.tensionSuperficial = 0;
		}else if(tensionSuperficial > 1.0){
			neurona.tensionSuperficial = 1.0;
		}else{
			neurona.tensionSuperficial = tensionSuperficial;
		}
		
	},
	activarExternal: function(valor){
		var neurona = this;
		
		neurona.setTension(valor);
		neurona.axon.activar();
		
	},
	procesar: function(){
		var neurona = this;
		
		
		var procesarDendritas = function(){
			
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
		};
		
		
		var valorDendritas = procesarDendritas();
		
		neurona.setTension(valorDendritas);
		neurona.axon.activar();
		

	},
	entrenar: function(signo){
		var neurona = this;
		

		// TODO: mejorar con un mapa de las dendritas inhibidoras y las activadores por separado, asi no se recorren de mas
		for(iDendrita in neurona.dendritas){
			var dendrita = neurona.dendritas[iDendrita];
			
			if(Math.sign(signo) == Math.sign(dendrita.peso)){
				dendrita.entrenar();
			}
			
		};
	}
};

