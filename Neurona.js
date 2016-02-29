
/************** :NEURONA: ************/
var Neurona = function(opt){
	$.extend(this, {
		red: null,		// container
		axon: null,
		tipo: "INTERNA",
		id: null,
		dendritas: [],
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
	
	procesar: function(){
		try{
			var neurona = this;
			
			
			
			var sumaValorDendritas = 0.0;
			
			for(iDendrita in neurona.dendritas){
				var dendrita = neurona.dendritas[iDendrita];
				
				
				dendrita.procesar();
				sumaValorDendritas += dendrita.valor;
				
			};
			
			
			//TODO: neurona.axon.depolarizar(sumaValorDendritas / neurona.dendritas.length);
			neurona.axon.depolarizar(sumaValorDendritas);
			
			if(neurona.axon.valor>0){
				
				for(iDendrita in neurona.dendritas){
					var dendrita = neurona.dendritas[iDendrita];
					dendrita.entrenar();
				};
			}
			
		}catch(e){
			debugger;
		}
	}
};
