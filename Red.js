


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
	COEF_UMBRAL_SINAPSIS_PESO: 0,
	start: function(){
		var red = this;
		
		
		for(var i = 0; i < red.size.x; i++){
			for(var j = 0; j < red.size.y; j++){
				
				var keyNeurona = red.id + "x"+i+"y"+j;
				
				var neurona = new Neurona({
					red: red,
					id: keyNeurona
				});
				
				// se hace una doble referencia, no es lo más prolijo pero si lo más cómodo:
				// Cumple con la interfaz de Entrada también
				red.neuronas[keyNeurona] = neurona;
			}
		}	
		
	},
	insertarAxones: function(opt){
		var red = this;
		
		opt = $.extend({
			modo			: 'full',
			entrada			: (typeof(opt.entrada) != "undefined") ? opt.entrada : red,
			peso			: null,
			cantDendritas	: 5,
			boxRelativo		: {
				x0 	: null,
				y0 	: null,
				x1 	: null,
				y1 	: null
			},
			boxRed		: {
				x0 	: 0,
				y0 	: 0,
				x1 	: red.size.x-1,
				y1 	: red.size.y-1				
			},
			boxEntrada	: (typeof(opt.entrada) != "undefined")?{
				x0 	: 0,
				y0 	: 0,
				x1 	: opt.entrada.size.x-1,
				y1 	: opt.entrada.size.y-1				
			}:{
				x0 	: 0,
				y0 	: 0,
				x1 	: red.size.x-1,
				y1 	: red.size.y-1			
			}
			
		}, opt);
		
		
		if(opt.modo=='full'){
			
			// RECORRO LA RED
			
			//========================================
			for(var rx = opt.boxRed.x0 ; rx <= opt.boxRed.x1; rx++){
				for(var ry = opt.boxRed.y0; ry <= opt.boxRed.y1; ry++){
			//========================================		
					
					var keyNeurona = red.id + "x"+rx+"y"+ry;
					var neuronaPadre = red.neuronas[keyNeurona];
					
					
					var dendrita = new Dendrita({
						neurona: neuronaPadre
					});
					neuronaPadre.dendritas.push(dendrita);
					
					
					// RECORRO LA ENTRADA: TODA por modo full
					//========================================		
							
					/*TODO: DEBUG*/
					opt.boxEntrada.y0 = ry;
					opt.boxEntrada.y1 = ry;
							
							
					for(var ex = opt.boxEntrada.x0; ex <= opt.boxEntrada.x1; ex++){
						for(var ey = opt.boxEntrada.y0; ey <= opt.boxEntrada.y1; ey++){
					//========================================		
							
							
							var keyNeurona_AxonEntrante = opt.entrada.id + "x"+ex+"y"+ey;
							
							var axonEntrante = opt.entrada.neurona[keyNeurona_AxonEntrante].axon;
							
							var sinapsis = new Sinapsis({
								neurona: neuronaPadre,
								axon: axonEntrante,
								peso: opt.peso
							});
							
							if(sinapsis.peso > red.COEF_UMBRAL_SINAPSIS_PESO){
								dendrita.sinapsis[keyNeurona_AxonEntrante] = sinapsis;
								opt.entrada.neuronas[keyNeurona_AxonEntrante].axon.sinapsis[keyNeurona] = sinapsis;
							}							
						}
					}
				}
			}
		}else if(opt.modo=='feed_foward_full'){
			
			// RECORRO LA RED
			//========================================
			for(var rx = 1; rx < red.size.x; rx++){
				for(var ry = 0; ry < red.size.y; ry++){
			//========================================		
					
					var keyNeurona = red.id + "x"+rx+"y"+ry;
					var neuronaPadre = red.neuronas[keyNeurona];
					
					
					var dendrita = new Dendrita({
						neurona: neuronaPadre
					});
					neuronaPadre.dendritas.push(dendrita);
					
					
					// RECORRO LA ENTRADA: el renglón anterior
					
					
					opt.entrada = red;
					//========================================
					var ex = rx - 1;
					for(var ey = 0; ey < opt.entrada.size.y; ey++){
					//========================================
						
						
						var keyNeurona_AxonEntrante = opt.entrada.id + "x"+ex+"y"+ey;
							
						var axonEntrante = opt.entrada.neurona[keyNeurona_AxonEntrante].axon;
						
						var sinapsis = new Sinapsis({
							neurona: neuronaPadre,
							axon: axonEntrante
						});
						
						
						if(sinapsis.peso > red.COEF_UMBRAL_SINAPSIS_PESO){
							dendrita.sinapsis[keyNeurona_AxonEntrante] = sinapsis;
							opt.entrada.neuronas[keyNeurona_AxonEntrante].axon.sinapsis[keyNeurona] = sinapsis;
						}
					}
				}
			}
		}else if(opt.modo=='relativo'){
			
			
			//========================================
			for(var rx = opt.boxRed.x0 ; rx <= opt.boxRed.x1; rx++){
				for(var ry = opt.boxRed.y0; ry <= opt.boxRed.y1; ry++){
			//========================================		
					
					var keyNeurona = red.id + "x"+rx+"y"+ry;
					var neuronaPadre = red.neuronas[keyNeurona]
					
					
					for(var iDentrita = 0; iDentrita < opt.cantDendritas; iDentrita++){
					
						var dendrita = new Dendrita({
							neurona: neuronaPadre
						});
						
						/*DEBUG:****************************/try{
						neuronaPadre.dendritas.push(dendrita);
						/*DEBUG:****************************/}catch(e){debugger;}
						
						
						
						
						// RECORRO LA ENTRADA
						//========================================
						var Ex0;
						var Ex1;
						var Ey0;
						var Ey1;
						
						if(opt.boxRelativo.x0 != null){ Ex0 = rx  + opt.boxRelativo.x0;} else { Ex0 = opt.boxEntrada.x0;}
						if(opt.boxRelativo.x1 != null){ Ex1 = rx  + opt.boxRelativo.x1;} else { Ex1 = opt.boxEntrada.x1;}
						if(opt.boxRelativo.y0 != null){ Ey0 = ry  + opt.boxRelativo.y0;} else { Ey0 = opt.boxEntrada.y0;}
						if(opt.boxRelativo.y1 != null){ Ey1 = ry  + opt.boxRelativo.y1;} else { Ey1 = opt.boxEntrada.y1;}
						
						
						
						
						if(Ex0 < 0)						{ Ex0 = 0; }
						if(Ex1 >= opt.entrada.size.x)	{ Ex1 = opt.entrada.size.x-1; }
						if(Ey0 < 0)						{ Ey0 = 0; }
						if(Ey1 >= opt.entrada.size.y)	{ Ey1 = opt.entrada.size.y-1; }
						
						for(var ex = Ex0; ex <= Ex1; ex++){
							for(var ey = Ey0; ey <= Ey1; ey++){
						//========================================		
								
								var keyNeurona_AxonEntrante = opt.entrada.id + "x"+ex+"y"+ey;
								
								if(keyNeurona_AxonEntrante != neuronaPadre.id){
									
									var axonEntrante = opt.entrada.neuronas[keyNeurona_AxonEntrante].axon;
									var sinapsis = new Sinapsis({
										neurona: neuronaPadre,
										axon: axonEntrante,
										peso: opt.peso
									});
									
									
									if(sinapsis.peso > red.COEF_UMBRAL_SINAPSIS_PESO){
										dendrita.sinapsis[keyNeurona_AxonEntrante] = sinapsis;
										opt.entrada.neuronas[keyNeurona_AxonEntrante].axon.sinapsis[keyNeurona] = sinapsis;
									}
								}
								
								
								
								
							}
						}
					}
				}
			}
		}
		
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
		
		try{
			for(key in red.bufferNeuronasProcess){
				bufferAux[key] = red.bufferNeuronasProcess[key];
			}
			
			red.bufferNeuronasProcess = {};
			
			for(key in bufferAux){
				bufferAux[key].procesar();
			}
		}catch(e){
			debugger;
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
};
/*************************************************/
