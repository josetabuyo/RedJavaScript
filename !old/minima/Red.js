


/************** :RED: ************/
var Red = function(opt){
	$.extend(this, {
		size: {x:0,y:0},
		id: null,
		axones: {},
		neuronas: {},
		bufferNeuronasProcess: {}
	}, opt);
	
	if(!this.id){
		this.id = Math.random();
	}
	
	this.start();
};


Red.prototype = {
	
	start: function(){
		var red = this;
		
		
		for(var i = 0; i < red.size.x; i++){
			for(var j = 0; j < red.size.y; j++){
				
				var idNeurona = red.id + "x"+i+"y"+j;
				
				var neurona = new Neurona({
					red: red,
					id: idNeurona
				});
				
				// se hace una doble referencia, no es lo más prolijo pero si lo más cómodo:
				// Cumple con la interfaz de Entrada también
				red.neuronas[idNeurona] = neurona;
				red.axones[idNeurona] = neurona.axon;
				
			}
		}	
		
	},
	insertarAxones: function(opt){
		var red = this;
		
		opt = $.extend({
			modo		: 'full'
		}, opt);
		
		
		if(opt.modo=='full'){
			
			for(var rx = 0; rx < red.size.x; rx++){
				for(var ry = 0; ry < red.size.y; ry++){
					
					for(var ex = 0; ex < opt.entrada.size.x; ex++){
						for(var ey = 0; ey < opt.entrada.size.y; ey++){
							
							var idNeurona = red.id + "x"+rx+"y"+ry;
							var idAxonEntrante = opt.entrada.id + "x"+ex+"y"+ey;
							
							var neuronaPadre = red.neuronas[idNeurona]
							var axonEntrante = opt.entrada.axones[idAxonEntrante]
							
							var sinapsis = new Sinapsis({
								neurona: neuronaPadre,
								axon: axonEntrante
							});
							
							sinapsis.neurona.sinapsis[idAxonEntrante] = sinapsis;
							opt.entrada.axones[idAxonEntrante].sinapsis[idNeurona] = sinapsis;
							
						}
					}
				}
			}
		}
		
	},
	procesar: function(){
		console.log('Red_procesar');
		var red = this;
		
		$.each(red.bufferNeuronasProcess, function(){
			var neurona = this;
			neurona.procesar();
			delete red.bufferNeuronasProcess[neurona.id];
		});
		
	}
};
/*************************************************/
