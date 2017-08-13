
/************** :NEURONA: ************/
var Neurona = function(opt){
	$.extend(this, {
		red: null,		// container
		axon: null,
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
			id: neurona.id
		});
		
	},
	procesar: function(){
		
		var neurona = this;
		
		
		
		
		var sumaValorDendritas = 0;
		neurona.dendritas.forEach(function(dendrita){
			sumaValorDendritas += dendrita.procesar();
		});
		
		// Activacion Promedio
		var valorDepolarizacion = sumaValorDendritas / neurona.dendritas.length;
		
		neurona.axon.set(valorDepolarizacion);
		
		neurona.dendritas.forEach(function(dendrita){
			dendrita.entrenar(neurona.axon.valor);
		});
		
		/*
		var valorPrimerDendrita = neurona.dendritas[0].procesar();
		var valorEntrenamiento = valorPrimerDendrita - 0.5;
		
		var sumaDendritasPredictoras = 0;
		
		for(var iDendrita = 1; iDendrita < neurona.dendritas.length; iDendrita++){
			sumaDendritasPredictoras += neurona.dendritas[iDendrita].procesar();
			
			
			neurona.dendritas[iDendrita].entrenar(valorEntrenamiento);
		}
		
		
		// Activacion Promedio
		var valor = valorPrimerDendrita;
		var valorPredictivo = sumaDendritasPredictoras / (neurona.dendritas.length-1);
		
		neurona.axon.set(valor);
		*/
		
		
		
	},
};




/************** :COLUMNA: ************/
/*
var Columna = function(opt){
	$.extend(this, {
		neuronas: []
	}, opt);

	return this;
};
$.extend(Columna.prototype, Axon);

Columna.prototype = {
	size: 1,
	procesar: function(){
		console.log('Columna_procesar');
		
		var columna = this;
		var maxVal = 0;
		
		$.each(columna.neuronas, function(){
			var neurona = this;
			neurona.procesar();
			if(neurona.valor = 1){
				columna.valor = 1;
				return columna.valor;
			}
		});
		
		
	}
};
*/



