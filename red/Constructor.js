var Constructor = {
	red: null,
	getRedData: function(){
		
		var _red = {
			size: red.size,
			box: red.box,
			id: red.id,
			neuronas: {}
		};
		
		
		Constructor.eachNeurona(red.box, function(rx, ry, neurona){
			
			var _neurona = {
				id: neurona.id,
				tipo: neurona.tipo,
				dendritas: []
			};
			
			
			for(iDendrita in neurona.dendritas){
				
				var _dendrita = {
					sinapsis: {},
					peso: neurona.dendritas[iDendrita].peso
				};
				
				
				for(key in neurona.dendritas[iDendrita].sinapsis){
					var sinapsis = neurona.dendritas[iDendrita].sinapsis[key];
					var _sinapsis = {
						id: sinapsis.id,
						peso: sinapsis.peso
						
					};
					
					
					_dendrita.sinapsis[sinapsis.id] = _sinapsis;
					
				}
				
				_neurona.dendritas.push(_dendrita);
				
			};
			
			_red.neuronas[neurona.id] = _neurona;
		});
		
		return _red;
	},
	
	setRedData: function(_red){
		var constructor = this;
		
		constructor.red = new Red(_red);
		
		var red = constructor.red;
		
		
		
		
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
		
		};
		
		
		for(key in red.neuronas){
			
			var neurona = red.neuronas[key];
			
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
					
					var neurona_AxonEntrante = red.neuronas[_sinapsis.id];
					
					var sinapsis = new Sinapsis(
						$.extend({},
							_sinapsis,
							{
								dendrita: dendrita,
								neurona_AxonEntrante: neurona_AxonEntrante
							}
						)
					);
					
					neurona_AxonEntrante.axon.sinapsis[neurona.id] = sinapsis;
					
					dendrita.sinapsis[sinapsis.id] = sinapsis;
				}
			};
			
		}
		
		return red;
		
	},
	makeEntrada: function(box){
		var red = this.red;
		
		for(var i = box.x0; i <= box.x1; i++){
			for(var j = box.y0; j <= box.y1; j++){
				
				var keyNeurona = red.id + "x" + i + "y" + j;
				var neurona = red.neuronas[keyNeurona];
				neurona.tipo = "ENTRADA";
				neurona.dendritas = [];
				neurona.procesar = function(){
					var neurona = this;
					
					neurona.setTension(neurona.tensionSuperficial);
					
					if(neurona.axon.valor == 1){
						neurona.red.bufferNeuronasProcess[neurona.id] = neurona;
					}
				};
				
			}
		}
		
	},
	
	makeSalida: function(box){
		var red = this.red;
		
		for(var i = box.x0; i <= box.x1; i++){
			for(var j = box.y0; j <= box.y1; j++){
				
				var keyNeurona = red.id + "x" + i + "y" + j;
				var neurona = red.neuronas[keyNeurona];
				neurona.tipo = "SALIDA";
				neurona.axon.sinapsis = {};
				
			}
		}
	},
	
	insertarAxones: function(opt){
		var red = this.red;
		
		opt = $.extend({
			modo				: 'relativo',
			peso				: null,
			cantDendritas		: 1,
			densidadConexionado	: (typeof(opt.densidadConexionado) != "undefined") ? opt.densidadConexionado : 1.0,
			boxRelativo		: {
				x0 	: null,
				y0 	: null,
				x1 	: null,
				y1 	: null
			},
			boxTarget			: red.box,
			boxEntrada			: red.box
			
		}, opt);
		
		this["modo_" + opt.modo](opt);
	},
	eachNeurona: function(box, callback){
		
		//========================================
		for(var rx = box.x0 ; rx <= box.x1; rx++){
			for(var ry = box.y0; ry <= box.y1; ry++){
		//========================================
				var keyNeurona = red.id + "x"+rx+"y"+ry;
				var neurona = red.neuronas[keyNeurona];
				
				callback(rx, ry, neurona);
				
			}
		}
	},
	eachNeuronaEntorno: function(rx, ry, neurona, boxRelativo, callback){
		var red = this.red;
		
		var Ex0;
		var Ex1;
		var Ey0;
		var Ey1;
		
		Ex0 = rx  + boxRelativo.x0;
		Ex1 = rx  + boxRelativo.x1;
		Ey0 = ry  + boxRelativo.y0;
		Ey1 = ry  + boxRelativo.y1;
		
		if(Ex0 < 0)				{ Ex0 = 0; }
		if(Ex1 >= red.size.x)	{ Ex1 = red.size.x-1; }
		if(Ey0 < 0)				{ Ey0 = 0; }
		if(Ey1 >= red.size.y)	{ Ey1 = red.size.y-1; }
		
		
		for(var ex = Ex0; ex <= Ex1; ex++){
			for(var ey = Ey0; ey <= Ey1; ey++){
				
				var keyNeurona_AxonEntrante = red.id + "x"+ex+"y"+ey;
				if(keyNeurona_AxonEntrante != neurona.id){
					
					var neurona_AxonEntrante = red.neuronas[keyNeurona_AxonEntrante];
					
					callback(neurona_AxonEntrante);
					
					
				}
			}
		}
	},
	eachNeuronaEntornoCorona: function(rx, ry, boxRelativo, callback){
		var Ex0;
		var Ex1;
		var Ey0;
		var Ey1;
		
		Ex0 = rx  + boxRelativo.x0;
		Ex1 = rx  + boxRelativo.x1;
		Ey0 = ry  + boxRelativo.y0;
		Ey1 = ry  + boxRelativo.y1;
		
		
		
		for(var ex = Ex0; ex <= Ex1; ex++){
			try{
				
				var ey = Ey0;
				var keyNeurona_AxonEntrante = red.id + "x"+ex+"y"+ey;
				
				var neurona_AxonEntrante = red.neuronas[keyNeurona_AxonEntrante];
				
				if(typeof(neurona_AxonEntrante) != "undefined"){
					callback(neurona_AxonEntrante, ex, ey);
				}
				
			}catch(e){
				//nada
			}
			
			///
			
			try{
				var ey = Ey1;
				
				var keyNeurona_AxonEntrante = red.id + "x"+ex+"y"+ey;
				
				var neurona_AxonEntrante = red.neuronas[keyNeurona_AxonEntrante];
				
				if(typeof(neurona_AxonEntrante) != "undefined"){
					callback(neurona_AxonEntrante, ex, ey);
				}
				
			}catch(e){
				//nada
			}
			
		}
		
		for(var ey = Ey0; ey <= Ey1; ey++){
			try{
				var ex = Ex0;
				
				var keyNeurona_AxonEntrante = red.id + "x"+ex+"y"+ey;
				
				var neurona_AxonEntrante = red.neuronas[keyNeurona_AxonEntrante];
				
				if(typeof(neurona_AxonEntrante) != "undefined"){
					callback(neurona_AxonEntrante, ex, ey);
				}
			}catch(e){
				//nada
			}
			
			///
			
			try{
				var ex = Ex1;
				
				var keyNeurona_AxonEntrante = red.id + "x"+ex+"y"+ey;
				
				var neurona_AxonEntrante = red.neuronas[keyNeurona_AxonEntrante];
				
				if(typeof(neurona_AxonEntrante) != "undefined"){
					callback(neurona_AxonEntrante, ex, ey);
				}
			}catch(e){
				//nada
			}
		}
	},
	
	eachNeuronaDendrita: function(opt, callback){
		
		/*
		Para usar dentro de un modo de interconexión
		EJEMPLO DE LLAMADO
			Constructor.eachNeuronaDendrita({
				
			});
		*/
		
		var red = this.red;
		var constructor = this;
		
		constructor.eachNeurona(opt.boxTarget, function(rx, ry, neurona){
			
			if(typeof(opt.dendritas_pesos) != "undefined"){
				opt.cantDendritas = opt.dendritas_pesos.length;
			}
			
			for(var iDentrita = 0; iDentrita < opt.cantDendritas; iDentrita++){
				
				var dendrita = new Dendrita({
					neurona: neurona
				});
				
				if(typeof(opt.dendritas_pesos) != "undefined"){
					dendrita.peso = opt.dendritas_pesos[iDentrita]
				}
				
				/*DEBUG:****************************/try{
				neurona.dendritas.push(dendrita);
				/*DEBUG:****************************/}catch(e){debugger;}
				
				callback(dendrita);
				
				
			}
		});
	},
	
	/*MODOS DE INSERCIÓN*/
	modo_full_random_fixed_input: function(opt){
		/*
		Para usar dentro de un modo de interconexión
		EJEMPLO DE LLAMADO
			Constructor.insertarAxones({
				modo: 'full_random_fixed_input',
				dendritas_pesos: [1],
				entrada	: entrada,
				boxTarget: {
					x0: red.box.x0,
					y0: red.box.y1-2,
					x1: red.box.x1,
					y1: red.box.y1-1
				}
				
			});
		*/
		
		
		var red = this.red;
		var constructor = this;
		
		constructor.eachNeuronaDendrita(opt, function(dendrita){
			// RECORRO LA ENTRADA
			//========================================
			var neurona = dendrita.neurona;
			
			for(var ex = opt.boxEntrada.x0; ex <= opt.boxEntrada.x1; ex++){
				for(var ey = opt.boxEntrada.y0; ey <= opt.boxEntrada.y1; ey++){
			//========================================		
					
					var keyNeurona_AxonEntrante = red.id + "x"+ex+"y"+ey;
					
					if(keyNeurona_AxonEntrante != neurona.id){
						
						var neurona_AxonEntrante = red.neuronas[keyNeurona_AxonEntrante];
						var axonEntrante = neurona_AxonEntrante.axon;
						
						var sinapsis = new Sinapsis({
							neurona_AxonEntrante: neurona_AxonEntrante,
							dendrita: dendrita,
							peso: opt.peso,
							id: keyNeurona_AxonEntrante
						});
						
						if(opt.densidadConexionado < 1){
							if(
								(Math.random() > opt.densidadConexionado) &&
								(sinapsis.peso > red.COEF_UMBRAL_SINAPSIS_PESO)
							){
								dendrita.sinapsis[keyNeurona_AxonEntrante] = sinapsis;
								red.neuronas[keyNeurona_AxonEntrante].axon.sinapsis[neurona.id] = sinapsis;
							}
						}else{
							if(
								(sinapsis.peso > red.COEF_UMBRAL_SINAPSIS_PESO)
							){
								dendrita.sinapsis[keyNeurona_AxonEntrante] = sinapsis;
								red.neuronas[keyNeurona_AxonEntrante].axon.sinapsis[neurona.id] = sinapsis;
							}
						}
						
					}
				}
			}
			
		});
		
	},
	modo_full: function(opt){
		var red = this.red;
		// RECORRO LA RED
			
		//========================================
		for(var rx = opt.boxTarget.x0 ; rx <= opt.boxTarget.x1; rx++){
			for(var ry = opt.boxTarget.y0; ry <= opt.boxTarget.y1; ry++){
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
						
						
						var keyNeurona_AxonEntrante = red.id + "x"+ex+"y"+ey;
						
						var neurona_AxonEntrante = red.neuronas[keyNeurona_AxonEntrante];
						var axonEntrante = neurona_AxonEntrante.axon;
						
						if(!opt.peso){
							opt.peso = Math.random()
						};
						
						if(opt.peso > red.COEF_UMBRAL_SINAPSIS_PESO){
							
							var sinapsis = new Sinapsis({
								neurona_AxonEntrante: neurona_AxonEntrante,
								peso: opt.peso,
								id: keyNeurona_AxonEntrante
							});
						
							dendrita.sinapsis[keyNeurona_AxonEntrante] = sinapsis;
							red.neuronas[keyNeurona_AxonEntrante].axon.sinapsis[keyNeurona] = sinapsis;
						}							
					}
				}
			}
		}
	},
	modo_relativo: function(opt){
		
		/*
		EJEMPLO DE LLAMADO
			Constructor.insertarAxones({
				modo: 'relativo',
				cantDendritas: 1,
				boxTarget: salida.box,
				boxRelativo	: {
					x0 	: -4,//-999,
					y0 	: 1,
					x1 	: 2,//999,
					y1 	: 4
				}
			});
		*/
		
		var red = this.red;
		var constructor = this;
		
		constructor.eachNeurona(opt.boxTarget, function(rx, ry, neurona){
			
			if(typeof(opt.dendritas_pesos) != "undefined"){
				opt.cantDendritas = opt.dendritas_pesos.length;
			}
			
			for(var iDentrita = 0; iDentrita < opt.cantDendritas; iDentrita++){
				
				var dendrita = new Dendrita({
					neurona: neurona
				});
				
				if(typeof(opt.dendritas_pesos) != "undefined"){
					dendrita.peso = opt.dendritas_pesos[iDentrita]
				}
				
				/*DEBUG:****************************/try{
				neurona.dendritas.push(dendrita);
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
				if(Ex1 >= red.size.x)			{ Ex1 = red.size.x-1; }
				if(Ey0 < 0)						{ Ey0 = 0; }
				if(Ey1 >= red.size.y)			{ Ey1 = red.size.y-1; }
				
				for(var ex = Ex0; ex <= Ex1; ex++){
					for(var ey = Ey0; ey <= Ey1; ey++){
				//========================================		
						
						var keyNeurona_AxonEntrante = red.id + "x"+ex+"y"+ey;
						
						var neurona_AxonEntrante = red.neuronas[keyNeurona_AxonEntrante];
						
						
						if(keyNeurona_AxonEntrante != neurona.id){
							
							var axonEntrante = neurona_AxonEntrante.axon;
							
							var sinapsis = new Sinapsis({
								neurona_AxonEntrante: neurona_AxonEntrante,
								dendrita: dendrita,
								peso: opt.peso,
								id: keyNeurona_AxonEntrante
							});
							
							
							if(sinapsis.peso > red.COEF_UMBRAL_SINAPSIS_PESO){
								dendrita.sinapsis[keyNeurona_AxonEntrante] = sinapsis;
								red.neuronas[keyNeurona_AxonEntrante].axon.sinapsis[neurona.id] = sinapsis;
							}
						}
					}
				}
			}
		});
	},
	modo_dendritas_radiales_pesadas: function(opt){
		/*
		EJEMPLO DE LLAMADO
			Constructor.insertarAxones({
				modo: 'dendritas_radiales_pesadas',
				dendritas_pesos: [1.0, 0.2, 0, -1.5, 0.2],
				boxTarget: {
					x0: red.box.x0,
					y0: red.box.y1-2,
					x1: red.box.x1,
					y1: red.box.y1-1
				},
				boxRelativo	: {
					x0 	: -5,
					y0 	: -1,
					x1 	: 5,
					y1 	: 0
				}
			});
		*/
		var red = this.red;
		var constructor = this;
		
		
		constructor.eachNeurona(opt.boxTarget, function(rx, ry, neurona){
			
			for(var iDentrita = 0; iDentrita < opt.dendritas_pesos.length; iDentrita++){
				
				if(opt.dendritas_pesos[iDentrita] == 0.0){
					continue;
				}
				
				var dendrita = new Dendrita({
					neurona: neurona,
					peso: opt.dendritas_pesos[iDentrita]
				});
				
				neurona.dendritas.push(dendrita);
				
				var box = {
					x0 	: -1 * (iDentrita+1),
					y0 	: -1 * (iDentrita+1),
					x1 	:  1 * (iDentrita+1),
					y1 	:  1 * (iDentrita+1)
				};
				
				constructor.eachNeuronaEntornoCorona(rx, ry, box, function(neurona_AxonEntrante, ex, ey){
					
					var Ex0;
					var Ex1;
					var Ey0;
					var Ey1;
					
					if(opt.boxRelativo.x0 != null){ Ex0 = rx  + opt.boxRelativo.x0;} else { Ex0 = red.box.x0;}
					if(opt.boxRelativo.x1 != null){ Ex1 = rx  + opt.boxRelativo.x1;} else { Ex1 = red.box.x1;}
					if(opt.boxRelativo.y0 != null){ Ey0 = ry  + opt.boxRelativo.y0;} else { Ey0 = red.box.y0;}
					if(opt.boxRelativo.y1 != null){ Ey1 = ry  + opt.boxRelativo.y1;} else { Ey1 = red.box.y1;}
					
					if(
						(ex >= Ex0) &&
						(ex <= Ex1) &&
						(ey >= Ey0) &&
						(ey <= Ey1)
					){
					
						var sinapsis = new Sinapsis({
							neurona_AxonEntrante: neurona_AxonEntrante,
							dendrita: dendrita,
							peso: opt.peso,
							id: neurona_AxonEntrante.id
						});
						
						
						if(sinapsis.peso > red.COEF_UMBRAL_SINAPSIS_PESO){
							dendrita.sinapsis[neurona_AxonEntrante.id] = sinapsis;
							red.neuronas[neurona_AxonEntrante.id].axon.sinapsis[neurona.id] = sinapsis;
						}
					}
				});
			}
		});
	}
	
};