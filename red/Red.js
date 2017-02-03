/************** :RED: ************/
var Red = function(opt){
	$.extend(this, {
		size: {x:0,y:0},
		id: null,
		neuronas: {},
		bufferNeuronasProcess: {}
	}, opt);
	
	if(!this.id){
		this.id = Math.random();
	}
	
	this.start();
};


Red.prototype = {
	COEF_UMBRAL_SINAPSIS_PESO: 0.2,
	start: function(){
		var red = this;
		
		if(Object.keys(red.neuronas).length > 0){
			for(key in red.neuronas){
				var _neurona = red.neuronas[key];
				
				var neurona = new Neurona(
					$.extend({},
						_neurona,
						{
							red: red
						}
					)
				);
				
				red.neuronas[neurona.id] = neurona;
				
				for(iDendrita in neurona.dendritas){
					
					var _dendrita = neurona.dendritas[iDendrita];
					
					var dendrita = new Dendrita(
						$.extend({},
							_dendrita,
							{
								neurona: neurona
							}
						)
						
					);
					
					
					neurona.dendritas[iDendrita] = dendrita;
					
					
					for(key in dendrita.sinapsis){
						
						var _sinapsis = dendrita.sinapsis[key];
						
						var sinapsis = new Sinapsis(
							$.extend({},
								_sinapsis,
								{
									dendrita: dendrita,
									axon: red.neuronas[_sinapsis.id]
								}
							)
						);
						
						dendrita.sinapsis[sinapsis.id] = sinapsis;
					}
				};
				
			}
			
		}else{
			for(var i = 0; i < red.size.x; i++){
				for(var j = 0; j < red.size.y; j++){
					
					var keyNeurona = red.id + "x"+i+"y"+j;
					
					var neurona = new Neurona({
						red: red,
						id: keyNeurona
					});
					
					red.neuronas[keyNeurona] = neurona;
				}
			}
		}
		/*Para mantener interzaf cómoda y común*/
		red.box = {
			x0: 0,
			x1: red.size.x - 1,
			y0: 0,
			y1: red.size.y - 1
		};
	},
	
	play: function(){
		var red = this;
		
		this.playInterval = setInterval(function() {
			
			if(Object.keys(red.bufferNeuronasProcess).length > 0){
				red.procesar();
			}
			
			//DEBUG
			$('#log').text(red.neuronas[red.id+"x0y0"].axon.valor);
			
			
		}, 10);

	},
	stop: function(){
		clearInterval(this.playInterval);
	},
	procesar: function(){
		
		var red = this;
		
		var bufferAux = {};
		
			for(key in red.bufferNeuronasProcess){
				bufferAux[key] = red.bufferNeuronasProcess[key];
			}
			
			red.bufferNeuronasProcess = {};
			
			for(key in bufferAux){
				try{
					bufferAux[key].procesar();
				}catch(e){
					//debugger;
					//es lo más barato
				}
			}
		
		red.onProcesar();
	
	},
	onProcesar_vEventos: [],
	onProcesar: function(param){
		if(typeof param == "function"){
			this.onProcesar_vEventos.push(param);
		}else{
			$.each(this.onProcesar_vEventos, function(index, value){
				value(param);
			});
		}
	}
}