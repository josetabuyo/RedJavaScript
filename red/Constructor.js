var Constructor = {
	red: null,
	getRedData: function(){

		var _red = {
			size: red.size,
			box: red.box,

			COEF_SINAPSIS_ENTRENAMIENTO				: Sinapsis.prototype.COEF_SINAPSIS_ENTRENAMIENTO,
			COEF_SINAPSIS_UMBRAL_PESO				: Sinapsis.prototype.COEF_SINAPSIS_UMBRAL_PESO,

			neuronas: {}
		};



		for(var key in red.neuronas){

			var neurona = red.neuronas[key];

			var _neurona = {
				id: neurona.id,
				region: neurona.region,
				dendritas: []
			};


			for(var iDendrita in neurona.dendritas){

				var dendrita = neurona.dendritas[iDendrita];

				var _dendrita = {
					id: dendrita.id,
					peso: dendrita.peso,
					sinapsis: {}
				};


				for(var key in dendrita.sinapsis){
					var sinapsis = dendrita.sinapsis[key];
					var _sinapsis = {
						id: sinapsis.id,
						peso: sinapsis.peso,

					};

					_dendrita.sinapsis[sinapsis.id] = _sinapsis;
				}


				_neurona.dendritas[dendrita.id] = _dendrita;
			};

			_red.neuronas[neurona.id] = _neurona;



		};

		return _red;
	},
	setRedData: function(_red){
		var construct = this;

		red = new Red();


		Sinapsis.prototype.COEF_SINAPSIS_ENTRENAMIENTO						= _red.COEF_SINAPSIS_ENTRENAMIENTO							;
		Sinapsis.prototype.COEF_SINAPSIS_UMBRAL_PESO 							= _red.COEF_SINAPSIS_UMBRAL_PESO								;


		//REHIDRATO LAS NEURONAS
		for(var key in _red.neuronas){


			var _neurona = _red.neuronas[key];

			var neurona = new Neurona({
				id: _neurona.id,
				region: _neurona.region,
				red: red
			});

			if(neurona.region == 'ENTRADA'){
				construct.makeEntradaNeurona(neurona);
			}

		}

		//REHIDRATO LAS DENDRITAS y los AXONES que tocan
		for(var key in _red.neuronas){

			var _neurona = _red.neuronas[key];
			var neurona = red.neuronas[key];



			for(var iDendrita in _neurona.dendritas){

				var _dendrita = _neurona.dendritas[iDendrita]

				var dendrita = new Dendrita({
					id:  _dendrita.id,
					peso: _dendrita.peso,
					neurona: neurona
				});


				for(var key in _dendrita.sinapsis){

					var _sinapsis = _dendrita.sinapsis[key];

					var sinapsis = new Sinapsis({
						id: _sinapsis.id,
						peso: _sinapsis.peso,
						dendrita: dendrita
					});

				}

			}
		}

		return red;

	},

	addNeurona: function(_neurona){

		if(_neurona.region == "ENTRADA"){

			var neurona = new NeuronaEntrada(_neurona);
			// var neurona = new NeuronaEntrada($.extend(_neurona, {
			// 	red: this.red
			// }));
		}else{

			var neurona = new Neurona(_neurona);

		}

	},
	addNeuronasBox: function(opt){
		var construct = this;

		$.extend(this, {
			size: {x:0,y:0}
		}, opt);





		for(var x=0; x < opt.size.x; x++){
			for(var y=0; y < opt.size.y; y++){

				construct.addNeurona({id: construct.keyByCoord(x,y)});
			}
		}


		return red;

	},




	keyByCoord: function(x, y){
		var construct = this;

		var keyNeurona="";

		keyNeurona += "x";
		keyNeurona += x ;
		keyNeurona += "y";
		keyNeurona += y ;

		return keyNeurona;

	},
	keyByIndex: function(index){
		var construct = this;

		return keyNeurona = Object.keys(red.neuronas)[index];

	},


	makeEntradaNeurona: function(neurona){

		_neurona = new NeuronaEntrada(neurona);
		_neurona.axon = neurona.axon;
		// re-apunto
		neurona.red.neuronas[neurona.id] = _neurona;
		// saco de la lista de process
		delete neurona.red.neuronas_process[neurona.id];

	},
	makeEntrada: function(box){
		var construct = this;

		for(var i = box.x0; i <= box.x1; i++){
			for(var j = box.y0; j <= box.y1; j++){

				var keyNeurona = "x" + i + "y" + j;
				construct.makeEntradaNeurona(red.neuronas[keyNeurona]);

			}
		}

	},

	makeSalida: function(box){

		for(var i = box.x0; i <= box.x1; i++){
			for(var j = box.y0; j <= box.y1; j++){

				var keyNeurona = "x" + i + "y" + j;
				var neurona = red.neuronas[keyNeurona];
				neurona.region = "SALIDA";
				neurona.axon.sinapsis = {};

			}
		}
	},

	insertarAxones: function(opt){

		opt = $.extend({
			modo				: 'relativo',
			peso				: null,
			cantDendritas		: 1,
			densidad	: (typeof(opt.densidad) != "undefined") ? opt.densidad : 1.0,
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


	conectarRegiones: function(keyRegiones){

		var keyRegionSource = keyRegiones[0];

		for (iKeyRegion in keyRegiones){
			if (iKeyRegion == 0) continue;

			var keyNeuronaArrayConector = []
			var keyRegionTarget = keyRegiones[iKeyRegion];

			for(var keyNeuronaTarget in this.red.regiones[keyRegionTarget]){

				keyNeuronaArrayConector = keyNeuronaArrayConector.concat(Object.keys(this.red.regiones[keyRegionSource]));
				keyNeuronaArrayConector.unshift(keyNeuronaTarget
				 );
				this.conectarNeuronas(keyNeuronaArrayConector);
			}
		}



	},

	conectarNeuronas: function(keyNeuronas){
		var keyNeuronaTarget = keyNeuronas.shift()

		var neuronaTarget = this.red.neuronas[keyNeuronaTarget];

		var dendrita = new Dendrita({
			neurona: neuronaTarget
		});


		for(var iKeyNeuronaSource in keyNeuronas){

			var keyNeuronaSource = keyNeuronas[iKeyNeuronaSource]

			var neuronaSource = this.red.neuronas[keyNeuronaSource];

			var sinapsis = new Sinapsis({
				neurona_AxonEntrante: neuronaSource,
				dendrita: dendrita,
				id: keyNeuronaSource
			});

			if(
				(sinapsis.peso > sinapsis.COEF_SINAPSIS_UMBRAL_PESO)
			){
				dendrita.sinapsis[keyNeuronaSource] = sinapsis;
				neuronaSource.axon.sinapsis[neuronaTarget.id] = sinapsis;
			}
		}


		neuronaTarget.dendritas[dendrita.id] = dendrita;


	},

	eachNeurona: function(box, callback){




		//========================================
		for(var rx = box.x0 ; rx <= box.x1; rx++){
			for(var ry = box.y0; ry <= box.y1; ry++){
		//========================================
				var keyNeurona = "x"+rx+"y"+ry;
				var neurona = red.neuronas[keyNeurona];
				if(typeof(neurona) != "undefined"){
					callback(rx, ry, neurona);
				};

			}
		}
	},
	eachNeuronaEntorno: function(rx, ry, neurona, boxRelativo, callback){


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

				var keyNeurona_AxonEntrante = "x"+ex+"y"+ey;
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
				var keyNeurona_AxonEntrante = "x"+ex+"y"+ey;

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

				var keyNeurona_AxonEntrante = "x"+ex+"y"+ey;

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

				var keyNeurona_AxonEntrante = "x"+ex+"y"+ey;

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

				var keyNeurona_AxonEntrante = "x"+ex+"y"+ey;

				var neurona_AxonEntrante = red.neuronas[keyNeurona_AxonEntrante];

				if(typeof(neurona_AxonEntrante) != "undefined"){
					callback(neurona_AxonEntrante, ex, ey);
				}
			}catch(e){
				//nada
			}
		}
	},

	eachNeuronaCreateDendritasCallback: function(opt, callback){

		/*
		Para usar dentro de un modo de interconexión
		EJEMPLO DE LLAMADO
			constructor.eachNeuronaCreateDendritasCallback({
				boxTarget:,
				dendritas_pesos:
			});
		*/


		var construct = this;

		construct.eachNeurona(opt.boxTarget, function(rx, ry, neurona){

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
				region	: {},
				boxTarget: {
				y0: red.box.y1-2,
					x0: red.box.x0,
					x1: red.box.x1,
					y1: red.box.y1-1
				}

			});
		*/



		var construct = this;

		construct.eachNeuronaCreateDendritasCallback(opt, function(dendrita){
			// RECORRO LA ENTRADA
			//========================================
			var neurona = dendrita.neurona;

			for(var ex = opt.boxEntrada.x0; ex <= opt.boxEntrada.x1; ex++){
				for(var ey = opt.boxEntrada.y0; ey <= opt.boxEntrada.y1; ey++){
			//========================================

					if(opt.densidad < 1){
						if(Math.random() > opt.densidad){
							continue;
						}
					}


					var keyNeurona_AxonEntrante = "x"+ex+"y"+ey;

					if(keyNeurona_AxonEntrante != neurona.id){

						var neurona_AxonEntrante = red.neuronas[keyNeurona_AxonEntrante];
						var axonEntrante = neurona_AxonEntrante.axon;



						var sinapsis = new Sinapsis({
							neurona_AxonEntrante: neurona_AxonEntrante,
							dendrita: dendrita,
							peso: opt.peso,
							id: keyNeurona_AxonEntrante
						});

						if(
							(sinapsis.peso > sinapsis.COEF_SINAPSIS_UMBRAL_PESO)
						){
							dendrita.sinapsis[keyNeurona_AxonEntrante] = sinapsis;
							red.neuronas[keyNeurona_AxonEntrante].axon.sinapsis[neurona.id] = sinapsis;
						}
					}
				}
			}

		});

	},
	modo_full: function(opt){

		// RECORRO LA RED

		//========================================
		for(var rx = opt.boxTarget.x0 ; rx <= opt.boxTarget.x1; rx++){
			for(var ry = opt.boxTarget.y0; ry <= opt.boxTarget.y1; ry++){
		//========================================

				var keyNeurona = "x"+rx+"y"+ry;
				var neuronaPadre = red.neuronas[keyNeurona];


				var dendrita = new Dendrita({
					neurona: neuronaPadre
				});

				// RECORRO LA ENTRADA: TODA por modo full
				//========================================

				/*TODO: DEBUG: DEPRECATED BLOCK*/
				opt.boxEntrada.y0 = ry;
				opt.boxEntrada.y1 = ry;


				for(var ex = opt.boxEntrada.x0; ex <= opt.boxEntrada.x1; ex++){
					for(var ey = opt.boxEntrada.y0; ey <= opt.boxEntrada.y1; ey++){
				//========================================


						var keyNeurona_AxonEntrante = "x"+ex+"y"+ey;

						var neurona_AxonEntrante = red.neuronas[keyNeurona_AxonEntrante];
						var axonEntrante = neurona_AxonEntrante.axon;

						if(!opt.peso){
							opt.peso = Math.random()
						};

						if(opt.peso > sinapsis.COEF_SINAPSIS_UMBRAL_PESO){

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


		var construct = this;

		construct.eachNeurona(opt.boxTarget, function(rx, ry, neurona){

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

						var keyNeurona_AxonEntrante = "x"+ex+"y"+ey;

						var neurona_AxonEntrante = red.neuronas[keyNeurona_AxonEntrante];


						if(keyNeurona_AxonEntrante != neurona.id){

							var axonEntrante = neurona_AxonEntrante.axon;

							var sinapsis = new Sinapsis({
								neurona_AxonEntrante: neurona_AxonEntrante,
								dendrita: dendrita,
								peso: opt.peso,
								id: keyNeurona_AxonEntrante
							});


							if(sinapsis.peso > sinapsis.COEF_SINAPSIS_UMBRAL_PESO){
								dendrita.sinapsis[keyNeurona_AxonEntrante] = sinapsis;
								red.neuronas[keyNeurona_AxonEntrante].axon.sinapsis[neurona.id] = sinapsis;
							}
						}
					}
				}
			}
		});
	},

	modo_coronas_dendriticas:function(opt){
		/*
		EJEMPLO DE LLAMADO
			Constructor.insertarAxones({
				modo: 'coronas_dendriticas',
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



		var construct = this;




		construct.eachNeurona(opt.boxTarget, function(rx, ry, neurona){



			for(var iCorona = 0; iCorona < opt.coronas.length; iCorona++){

				var _corona = opt.coronas[iCorona];


				//NOTE: Tuneo, podría no estar, es para que no pierda tiempo
				if(_corona.peso == 0.0){
					continue;
				}
				///////



				for(var iRadioCorona = _corona.radioDesde; iRadioCorona <= _corona.radioHasta; iRadioCorona++){

					var box = {
						x0 	: -1 * (iRadioCorona+1),
						y0 	: -1 * (iRadioCorona+1),
						x1 	:  1 * (iRadioCorona+1),
						y1 	:  1 * (iRadioCorona+1)
					};


					var dendrita = null;

					var totalNeuronasEnRadioCorona = Math.pow(2, iRadioCorona + 3);


					var anchoDendritas = totalNeuronasEnRadioCorona / _corona.cantDendritas;


					var cantSinapsis = 0;
					construct.eachNeuronaEntornoCorona(rx, ry, box, function(neurona_AxonEntrante, ex, ey){

						if(_corona.densidad < 1){
							if(Math.random() > _corona.densidad){
								return;
							}
						}

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

							if((cantSinapsis > anchoDendritas) || (dendrita == null)){

								dendrita = new Dendrita({
									neurona: neurona,
									peso: _corona.peso
								});

								cantSinapsis=0;
							}

							var sinapsis = new Sinapsis({
								neurona_AxonEntrante: neurona_AxonEntrante,
								dendrita: dendrita,
								//peso: 1, //DEBUG:
								id: neurona_AxonEntrante.id
							});


							if(sinapsis.peso > sinapsis.COEF_SINAPSIS_UMBRAL_PESO){
								dendrita.sinapsis[neurona_AxonEntrante.id] = sinapsis;
								red.neuronas[neurona_AxonEntrante.id].axon.sinapsis[neurona.id] = sinapsis;
							}

							cantSinapsis++;

						}
					});
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

		var construct = this;


		construct.eachNeurona(opt.boxTarget, function(rx, ry, neurona){

			for(var iDentrita = 0; iDentrita < opt.dendritas_pesos.length; iDentrita++){

				if(opt.dendritas_pesos[iDentrita] == 0.0){
					continue;
				}

				var dendrita = new Dendrita({
					neurona: neurona,
					peso: opt.dendritas_pesos[iDentrita]
				});

				var box = {
					x0 	: -1 * (iDentrita+1),
					y0 	: -1 * (iDentrita+1),
					x1 	:  1 * (iDentrita+1),
					y1 	:  1 * (iDentrita+1)
				};

				construct.eachNeuronaEntornoCorona(rx, ry, box, function(neurona_AxonEntrante, ex, ey){

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


						if(sinapsis.peso > sinapsis.COEF_SINAPSIS_UMBRAL_PESO){
							dendrita.sinapsis[neurona_AxonEntrante.id] = sinapsis;
							red.neuronas[neurona_AxonEntrante.id].axon.sinapsis[neurona.id] = sinapsis;
						}
					}
				});
			}
		});
	},

	insertarAxonesConMascara: function(opt){

		opt = $.extend({
			keyNeurona	: null,
			mascara 	: null
		}, opt);

		var keys = [];
		var construct = this ;


		if(opt.keyNeurona){
			keys.push(opt.keyNeurona);
		}else{
			keys = Object.keys(red.neuronas);
		}


		for(var iKey in keys){

			var neurona = red.neuronas[keys[iKey]];

			opt.cantDendritas = opt.mascara.length;

			for(var iDentrita = 0; iDentrita < opt.cantDendritas; iDentrita++){


				var dendrita = new Dendrita({
					neurona: neurona
				});

				$.extend(dendrita, opt.mascara[iDentrita].data);


				for(var key in opt.mascara[iDentrita].cels){

					var parts = key.split("y");
					parts[0] = parts[0].replace("x", "");


					var partsNeurona = neurona.id.split("y");
					partsNeurona[0] = partsNeurona[0].replace("x", "");




					coord = {
						x: parseInt(parts[0]) + parseInt(partsNeurona[0]),
						y: parseInt(parts[1]) + parseInt(partsNeurona[1])
					};



					var keyNeurona_AxonEntrante = "x"+coord.x+"y"+coord.y;

					if((keyNeurona_AxonEntrante != neurona.id) && (typeof(red.neuronas[keyNeurona_AxonEntrante]) != "undefined") ){

						if((dendrita.densidad < 1) && (Math.random() > dendrita.densidad)){
							continue;
						};



						var neurona_AxonEntrante = red.neuronas[keyNeurona_AxonEntrante];

						var axonEntrante = neurona_AxonEntrante.axon;

						var sinapsis = new Sinapsis({
							neurona_AxonEntrante: neurona_AxonEntrante,
							dendrita: dendrita,
							id: keyNeurona_AxonEntrante
						});

						if(
							(sinapsis.peso > sinapsis.COEF_SINAPSIS_UMBRAL_PESO)
						){
							dendrita.sinapsis[keyNeurona_AxonEntrante] = sinapsis;
							red.neuronas[keyNeurona_AxonEntrante].axon.sinapsis[neurona.id] = sinapsis;
						}
					}
				}

				neurona.dendritas[dendrita.id] = dendrita;
			}
		};
	}

};




				/*
				Constructor.insertarAxones({
					modo: 'coronas_dendriticas',
					boxTarget: {
						x0: red.box.x0,
						y0: red.box.y0,
						x1: red.box.x1,
						//y1: red.box.y1-1
						y1: red.box.y1
					},
					coronas: [
						{peso: 1		, densidad: 1,		radioDesde: 0	, radioHasta: 0	, cantDendritas: 1},
						{peso: 0.3		, densidad: 1,		radioDesde: 1	, radioHasta: 1	, cantDendritas: 1},
						{peso: 0},
						{peso: -1.5		, densidad: 1,		radioDesde: 3	, radioHasta: 3	, cantDendritas: 1},
						{peso: 0.2		, densidad: 0.2,	radioDesde: 4	, radioHasta: 6	, cantDendritas: 1}
					]
				});
				*/


				/*

				Constructor.insertarAxones({
					modo: 'dendritas_radiales_pesadas',
					boxTarget: {
						x0: red.box.x0,
						y0: red.box.y0,
						x1: red.box.x1,
						y1: red.box.y1-1
					},
					dendritas_pesos: [1.0, 0.2, 0, -1.5, 0.2],


				});

				*/

				//Prueba con region relativa, para que fluya
				/*Constructor.insertarAxones({
					modo: 'relativo',
					dendritas_pesos: [-0.2],
					boxTarget: {
						x0: red.box.x0,
						y0: red.box.y0,
						x1: red.box.x1,
						y1: red.box.y1-1
					},
					boxRelativo	: {
						x0 	: -4,
						y0 	: 2,
						x1 	: 4,
						y1 	: 2
					}
				});

				Constructor.insertarAxones({
					modo: 'relativo',
					dendritas_pesos: [1.6],
					boxTarget: {
						x0: red.box.x0,
						y0: red.box.y0,
						x1: red.box.x1,
						y1: red.box.y1-1
					},
					boxRelativo	: {
						x0 	: -4,
						y0 	: 3,
						x1 	: 4,
						y1 	: 4
					}
				});

				*/

				/*
				//entrada con campana reforzada
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
