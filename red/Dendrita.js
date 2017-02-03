
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
	COEF_DENDRITA_DECAIMIENTO: 0.37,
	start: function(){
		
	},
	entrenar: function(){
		var dendrita = this;
		var sinapsis = dendrita.sinapsis;
		
		
		if(Object.keys(sinapsis).length > 0){
			var suma = 0;
			
			for(key in sinapsis){
				var sinap = sinapsis[key];
				suma += sinap.entrenar(dendrita.valor * dendrita.neurona.axon.valor);
			}
			
		}
		
	},
	procesar: function(){
		var self = this;
		
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
		
		
		dendrita.valor += valor * self.peso;
		
		
		
		dendrita.valor -= dendrita.valor * dendrita.COEF_DENDRITA_DECAIMIENTO;
		
		
		return valor;
	}
};