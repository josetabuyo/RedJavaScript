
/************** :CAPA: ************/
var Dendrita = function(opt){
	$.extend(this, {
		valor: 0,
		peso: 1,
		COEF_DENDRITA_DECAIMIENTO: 0.1,
		sinapsis:{}
		
	}, opt);
	
	this.start();
};

Dendrita.prototype = {
	start: function(){
		
	},
	entrenar: function(valorEntrenamiento){
		var dendrita = this;
		var sinapsis = dendrita.sinapsis;
		
		if(Object.keys(sinapsis).length > 0){
			var suma = 0;
			
			for(key in sinapsis){
				var sinap = sinapsis[key];
				suma += sinap.entrenar(valorEntrenamiento);
			}
			
		}
	},
	procesar: function(){
		
		var dendrita = this;
		var sinapsis = dendrita.sinapsis;
		
		if(Object.keys(sinapsis).length > 0){
			var suma = 0;
			for(key in sinapsis){
				var sinap = sinapsis[key];
				suma += sinap.procesar();
			}
			
			// Activacion Promedio
			var valor = suma / Object.keys(sinapsis).length;
			
		}
		

		//TODO: analizar como funcionaría:
		// dendrita.valor = valor;
		if(valor > dendrita.valor){
			dendrita.valor = valor;
		}else{
			dendrita.valor -= dendrita.valor * dendrita.COEF_DENDRITA_DECAIMIENTO;
		}
		
		return valor;
	}
};