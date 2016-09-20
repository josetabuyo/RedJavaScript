
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
	start: function(){
		var neurona = this;
		
		this.axon = new Axon({
			neurona: neurona,
			id: neurona.id
		});
		
	},
	activar: function(valor){
		var neurona = this;
		
		if(valor < 0){
			neurona.tensionSuperficial = 0;
		}else if(valor > 1.0){
			neurona.tensionSuperficial = 1.0;
		}else{
			neurona.tensionSuperficial = valor;
		}
		
		neurona.axon.activar();
		
	},
	procesar: function(){
		try{
			var neurona = this;
			
			
			
			var sumaValorDendritas = 0.0;
			
			for(iDendrita in neurona.dendritas){
				var dendrita = neurona.dendritas[iDendrita];
				
				
				dendrita.procesar();
				
				sumaValorDendritas += dendrita.valor;
				
			};
			
			neurona.activar(sumaValorDendritas / neurona.dendritas.length);
			
			
			/*
			if(neurona.axon.valor>0){
				
				for(iDendrita in neurona.dendritas){
					var dendrita = neurona.dendritas[iDendrita];
					dendrita.entrenar();
				};
			}
			*/
			
		}catch(e){
			debugger;
		}
	}
};
