
/************** :NEURONA: ************/
var Neurona = function(opt){
	$.extend(this, {
		red: null,		 // container
		axon: null,
		id: null,
		sinapsis:{},
		
		umbral: 0.02
	}, opt);
	
	this.axon = new Axon();
	if(!this.id){
		this.id = Math.random();
	}
	
	this.start();
};

Neurona.prototype = {
	start: function(){
		
	},
	debeProcesar: function(){
		this.red.bufferNeuronasProcess[this.id] = this;
	},
	procesar: function(){
		var neurona = this;
		
		console.log('Neurona_procesar');
		console.log('Object.keys(neurona.sinapsis).length');
		console.log(Object.keys(neurona.sinapsis).length);
		
		var suma = 0;
		
		for(clave in neurona.sinapsis){
			var sinap = neurona.sinapsis[clave];
			suma += sinap.procesar();
		}
		
		
		// Activacion Promedio
		var valor = suma / Object.keys(neurona.sinapsis).length;
		
		// binarizado
		if(valor > neurona.umbral){
			valor = 1;
		}else{
			valor = 0;
		}
		
		neurona.axon.set(valor);
	}
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



