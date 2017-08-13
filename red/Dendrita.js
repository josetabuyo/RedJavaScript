
/************** :DENDRITA: ************/
var Dendrita = function(opt){
	
	$.extend(this, {
		neurona: null,
		valor: 0.0,
		peso: 1.0,
		sinapsis:{}
		
	}, opt);
	
	this.start();
};

Dendrita.prototype = {
	start: function(){
		
	},
	procesar: function(){
		var dendrita = this;
		
		var sinapsis = dendrita.sinapsis;
		
		var valor;
		if(Object.keys(sinapsis).length > 0){
			var suma = 0;
			for(key in sinapsis){
				var sinap = sinapsis[key];
				suma += sinap.procesar();
			}
			
			
			// Activacion Promedio
			valor = suma / Object.keys(sinapsis).length;
		}
		
		dendrita.valor = valor * dendrita.peso;
		
		
		return valor;
	},
	entrenar: function(){
		var dendrita = this;
		var sinapsis = dendrita.sinapsis;
		
		
		var tensionDendrita = dendrita.valor * dendrita.peso;

		//TODO: probar con
		// dendrita.neurona.tensionSuperficial - tensionDendrita;
		var valorEntrenamiento = 1 - Math.abs(dendrita.neurona.axon.valor - tensionDendrita);


		if(Object.keys(sinapsis).length > 0){
			var suma = 0;
			
			for(key in sinapsis){
				var sinap = sinapsis[key];
				
				suma += sinap.entrenar(valorEntrenamiento);
			}
			
		}
		
	}
};