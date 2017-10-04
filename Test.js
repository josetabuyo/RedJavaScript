/************** :TEST: ************/
var Test = function(opt){
	$.extend(this, {
		entrada: null,
		salida: null,
		noise: true
	}, opt);
	
	
	this.start();
};

Test.prototype = {
	NOISE_LEVEL: 0.01,
	running: false,
	estado: {
		current:	{
			neuronaCoord: {x:null, y:null}
		}
	},
	patron: {
		mapaCelda: [],
		entrada: [0,0,0,1,1,1,0,0,1,1,1,0,0,0],
		salida: [0,0,0,0,0,1,1,1,1,0,0,0,0,0]
	},
	testInterval: null,
	
	desplazamientoConstante: function(){
		var test = this;
		
		var testIndex =  test.estado.current.neuronaCoord.x;
			
		if(testIndex == null){
			testIndex = Math.round(test.red.size.x / 2);
			test.estado.current.neuronaCoord = {x: testIndex, y: test.red.size.y - 1};
		}
		
		
		for(var i = test.boxEntrada.x0; i <= test.boxEntrada.x1; i++){
			for(var j = test.boxEntrada.y0; j <= test.boxEntrada.y1; j++){
				var valor;
				
				if(test.noise){
					valor = Math.random() * test.NOISE_LEVEL;
				}else{
					valor = 0;
				}
				
				var keyNeurona = Constructor.keyByCoord(i, j);
				
				test.red.neuronas[keyNeurona].activarExternal(valor);
				
				
				
			}
		}
		
		
		
		
		
		for(var iEntrada = 0; iEntrada < test.patron.entrada.length; iEntrada++){
			var x = testIndex - iEntrada;
			var y = test.red.size.y - 1;
			
			if(x < 0){
				x = test.red.size.x + x;
			}
			
			var index = test.patron.entrada.length - 1 - iEntrada;
			
			var keyNeuronaEntrada = Constructor.keyByCoord(x, y);
			test.red.neuronas[keyNeuronaEntrada].activarExternal(test.patron.entrada[index]);
			
			var keyNeuronaSalida = Constructor.keyByCoord(x, 0);
			test.red.neuronas[keyNeuronaSalida].activarExternal(test.patron.salida[index]);
			
		}
		
		
		
		test.estado.current.neuronaCoord.x++;
		if(test.estado.current.neuronaCoord.x >= test.red.size.x){
			test.estado.current.neuronaCoord.x = 0;
		}
		
		
		
		
		test.red.procesar();
	},
	
	foco: null,
	offset: 0,
	
	printEntrada: function(){
		var test = this;
		
		
		
		
		
		
		for(var i = test.boxEntrada.x0; i <= test.boxEntrada.x1; i++){
			for(var j = test.boxEntrada.y0; j <= test.boxEntrada.y1; j++){
				var valor = 0;
				
				if(test.noise){
					valor = Math.random() * test.NOISE_LEVEL;
				}else{
					valor = 0;
				}
				
				var keyNeurona = Constructor.keyByCoord(i, j);
				
				test.red.neuronas[keyNeurona].activarExternal(valor);
				
			}
		}
		
		
		
		
		if(!test.foco){
			test.foco = test.red.size.x / 2;
		}
		
		for(var iEntrada = 0; iEntrada < test.patron.entrada.length; iEntrada++){
			
			var x = test.foco - iEntrada + Math.round(test.patron.entrada.length / 2) + test.offset;
			var y = test.red.size.y - 1;
			
			if(x < 0){
				x = x + test.red.size.x;
			}
			
			if(x > test.red.size.x - 1){
				x = x - test.red.size.x;
			}
			

			var index = test.patron.entrada.length - 1 - iEntrada;
			try{
				var keyNeurona = Constructor.keyByCoord(x, y);
				var valor = test.patron.entrada[index];
				
				
				test.red.neuronas[keyNeurona].activarExternal(valor);
				
				
			}catch(e){
				debugger;
			}
			
		}
	},
	obtenerSalida: function(modo){
		
		//tomo el centro de masa (x,y) de la salida 
		var sumaTension = 0.0;
		
		var sumaProducto = {
			x: 0.0,
			y: 0.0
		};
		
		for(var i = test.boxSalida.x0; i <= test.boxSalida.x1; i++){
			for(var j = test.boxSalida.y0; j <= test.boxSalida.y1; j++){
				
				var keyNeurona = "x" + i + "y" + j;
				var neurona = test.red.neuronas[keyNeurona];
				
				sumaTension += neurona.tensionSuperficial;
				sumaProducto.x += neurona.tensionSuperficial * (i+1);
				sumaProducto.y += neurona.tensionSuperficial * (j+1);
				
				if(neurona.tensionSuperficial > 1){
					// DEBUG: no debería pasar esto
					debugger;
				}
				
				
				if(sumaTension > test.boxSalida.x1){
					// DEBUG: no debería pasar esto
					debugger;
				}

				if(sumaTension > sumaProducto.x){
					// DEBUG: no debería pasar esto
					debugger;
				}
				

			}
		}
		
		
		if(sumaTension > 0){
			var mediaX = sumaProducto.x / sumaTension * 1.0;
		}
		
		return Math.round(mediaX);
		
		
	},
	
	step_secada: function(){
		var test = this;
		
		test.printEntrada();
		
		test.red.procesar();
		
		//ubico el foco en la media.x de la salida
		
		test.foco = test.obtenerSalida('mediaX');
		
		var dolor_set = test.foco + test.offset;
		
		var dolor_target = test.red.size.x / 2;
		
		var dolor = Math.abs(dolor_target - dolor_set) / dolor_target;
		
		
		//Sinapsis.prototype.COEF_SINAPSIS_ENTRENAMIENTO = (-dolor) * 0.1;
	},
	debugEstandar: function(){
		var test = this;
		
		test.printEntrada();
		
		test.red.procesar();
		
	},
	
	world: {
		context: {
			
			automata: null,
			externo: null,
			debugMode: false,
			motor: [0.0, 0.0, 0.0, 0.0]
		},
		load: function(){
			var world = this;
			
			var snapWorld = Snap("#svgWorld");
			
			var fondo = snapWorld.group(
				snapWorld.rect(0,0, $("#svgWorld").width(), $("#svgWorld").height())
			);
			fondo.attr({
				fill: "#000000"
			});
			fondo.click(function(){
				world.context.debugMode = !world.context.debugMode;
			});
			
			
			var automata = snapWorld.group(
				snapWorld.circle(0, 0, 30)
			);
			automata.attr({
				fill: "rgb(0,0,255)"
			});
			automata.transform('T200,150');
			
			world.context.automata = automata;
			
			



			
			world.addExterno({color: "rgb(255,0,0)"});
			world.addExterno({color: "rgb(255,0,0)"});
			world.addExterno({color: "rgb(255,0,0)"});
			
			world.addExterno({color: "rgb(0,255,0)"});
			world.addExterno({color: "rgb(0,255,0)"});
			world.addExterno({color: "rgb(0,255,0)"});
			
			
			$('body').on('keydown', function(e){
				var motor = world.context.motor;
				
				switch (e.which) {
					case 37:
						motor[0] = 1.0;
						e.preventDefault(); 
						break;
					case 38:
						motor[2] = 1.0;
						e.preventDefault();
						break;
					case 39:
						motor[1] = 1.0;
						e.preventDefault(); 
						break;
					case 40:
						motor[3] = 1.0;
						e.preventDefault(); 
						break;
				};
				
				
			});
			
			
			$('body').on('keyup', function(e){
				var motor = world.context.motor;
				
				switch (e.which) {
					case 37:
						motor[0] = 0.0;
						break;
					case 38:
						motor[2] = 0.0;
						break;
					case 39:
						motor[1] = 0.0;
						break;
					case 40:
						motor[3] = 0.0;
						break;
				};
				
			});
			
		},
		step: function(){
			var paso = 5;

			var automata = test.world.context.automata;
			

			
			/// PASO 1:
			/// ACTUALIZA EXTERNOS
			


			var moverExterno = function(externo){
				//TODO: quitar cuando no se requiera mas
				if(test.world.context.debugMode) return;

				//mover los elementos del mundito: externo, enemigos, etc
				
				var vel = {
					x: 0,
					y: 0.5
				};
				
				var bb = externo.getBBox();
				
				var pos = {
					x: (bb.x + (bb.width / 2)) + (vel.x * paso),
					y: (bb.y + (bb.height / 2)) + (vel.y * paso)
				};
				
				
				if(!(pos.y > $("#svgWorld").height())){
					externo.transform( 'T' + pos.x + ',' + pos.y);
				}else{

					var vColor = test.world.getColor(externo);
					externo.remove();

					test.world.addExterno({
						pos:{
							y: 0
						},
						color: "rgb(" + vColor[0] + "," + vColor[1] + "," + vColor[2] + ")"
					});
				}
			};
			
			
			var snapWorld = Snap("#svgWorld");
			
			

			snapWorld.selectAll('.externo').forEach(function(externo){
			    moverExterno(externo);
			});
			
			
			
			
			/// PASO 2:
			/// PROYECTA EN RETINA
			test.world.printEntrada();




			/// PASO 3:
			/// DETECTAR COLICIONES
			
			


			
			
			var distancia = function(externo){

				var bb = externo.getBBox();
				var radExterno = (bb.width / 2)

				var posExterno = {
					x: (bb.x + radExterno),
					y: (bb.y + radExterno)
				};
				
				var bb = automata.getBBox();
				var radAutomata = (bb.width / 2)

				var posAutomata = {
					x: (bb.x + radAutomata),
					y: (bb.y + radAutomata)
				};

				var vec = {
					x: (posAutomata.x - posExterno.x),
					y: -(posAutomata.y - posExterno.y)
				};
				
				
				var distancia = Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2));


				return (distancia - radExterno - radAutomata) / (2 * radAutomata);


				
			}

			





			var solapamiento = {
				penetracion: 0,
				color: null
			};

			snapWorld.selectAll('.externo').forEach(function(externo){

				var distanciaExterno = distancia(externo);
			    if(distanciaExterno < 0 ){
				    
			    	var penetracion = -distanciaExterno;


			    	console.log(penetracion);
			    	
					var vColor = test.world.getColor(externo);

			    	
					if(penetracion > solapamiento.penetracion){
				    	solapamiento = {
							penetracion: penetracion,
							color: vColor
						};
			    	}
			    	
			    }
			});


			var COEF_DOLOR = 0.01;

			// ESTIMULOS HORMONALES AL SISTEMA POR PENETRACION
			if(solapamiento.penetracion > 0){

				var valor;

		    	if(solapamiento.color[0]==255){
		    		//MALO
					valor = (1 - solapamiento.penetracion);
		    	}else{
		    		//BUENO
					valor = solapamiento.penetracion;
		    	}
				

				valor = valor * COEF_DOLOR;

			    setCoef(Sinapsis.prototype, "COEF_SINAPSIS_ENTRENAMIENTO", valor, 100);

			
			} else {

				var valor = Sinapsis.prototype.COEF_SINAPSIS_ENTRENAMIENTO_DEFAULT;
				setCoef(Sinapsis.prototype, "COEF_SINAPSIS_ENTRENAMIENTO", valor, 100);
		    }




			
			/// PASO 4:
			/// PROCESA LA RED
			test.red.procesar();
			




			/// PASO 5:
			/// LEE SALIDAS MUEVE MOTORES
			

			var motor = [0.0, 0.0, 0.0, 0.0];;


			var COEF_LOCAL_POW_MOTOR = 2;

			var sumaTensionTotalSalida = 0.0;

			



			//TODO: quitar cuando no se requiera mas
			if(!test.world.context.debugMode){

				Constructor.eachNeurona({
					x0: 0,
					y0: 0,
					x1: red.box.x1,
					y1: 0
				}, function(rx, ry, neurona){
					
					var indiceMotor = Math.floor((rx / red.size.x) * motor.length);

					
					if(! isNaN(neurona.tensionSuperficial)){

						motor[indiceMotor] += neurona.tensionSuperficial;
						
						sumaTensionTotalSalida += neurona.tensionSuperficial;
					}
				});
			};



			for(iMotor in motor){
				//lo normalizo
				if(sumaTensionTotalSalida){
					motor[iMotor] = motor[iMotor] / sumaTensionTotalSalida * COEF_LOCAL_POW_MOTOR;
				}else{
					motor[iMotor] = 0.0;
				}

				//Le sumo lo que se haya hecho con el motor por fuera (teclas)
				motor[iMotor] += test.world.context.motor[iMotor];
			}
			

			/// PASO 6:
			/// ACTUALIZA POSICION DEL AUTOMATA
			


			var vel = {
				x: motor[1] - motor[0],
				y: motor[3] - motor[2]
			};
			
			var bb = automata.getBBox();
			
			var pos = {
				x: (bb.x + (bb.width / 2)) + (vel.x * paso),
				y: (bb.y + (bb.height / 2)) + (vel.y * paso)
			};
			
			if(pos.x < 0) pos.x = $("#svgWorld").width();
			if(pos.y < 0) pos.y = $("#svgWorld").height();
			if(pos.x > $("#svgWorld").width()) pos.x = 0;
			if(pos.y > $("#svgWorld").height()) pos.y = 0;
				
			automata.transform( 'T' + pos.x + ',' + pos.y);
			
		},
		printEntrada: function(){
			
			//Ponemos base de ruido
			for(var i = test.boxEntrada.x0; i <= test.boxEntrada.x1; i++){
				for(var j = test.boxEntrada.y0; j <= test.boxEntrada.y1; j++){
					var valor = 0;
					
					if(test.noise){
						valor = Math.random() * test.NOISE_LEVEL;
					}else{
						valor = 0;
					}
					
					var keyNeurona = Constructor.keyByCoord(i, j);
					
					test.red.neuronas[keyNeurona].activarExternal(valor);
				}
			}
			
			
			

			

			
			var printExterno = function(externo){

				var bb = externo.getBBox();
				var rad = (bb.width / 2)
				

				var posExterno = {
					x: (bb.x + rad),
					y: (bb.y + rad)
				};
				
				var automata = test.world.context.automata;
				var bb = automata.getBBox();
				
				var posAutomata = {
					x: (bb.x + rad),
					y: (bb.y + rad)
				};
				
				var vec = {
					x: (posAutomata.x - posExterno.x),
					y: -(posAutomata.y - posExterno.y)
				};
				
				
				var distancia = Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2));
				
				if(distancia > rad * 16) return; /// Estaría muy lejos, no lo vería
				
				
				var anguloOffset = Math.atan2(rad, distancia);
				
				
				var anguloCentro = Math.atan2(vec.x, vec.y);
				
				var anguloMax = anguloCentro + anguloOffset;
				var anguloMin = anguloCentro - anguloOffset;
				
				var pixelMax = Math.round((test.red.size.x / (2*Math.PI)) * anguloMax);
				var pixelMin = Math.round((test.red.size.x / (2*Math.PI)) * anguloMin);
				
				var vColor = test.world.getColor(externo);


				for(var i = pixelMin; i <= pixelMax; i++){
					var index = i;
					
					if((index < test.red.box.x0)) {
						index+= test.red.size.x;
					}else if((index > test.red.box.x1)) {
						index-= test.red.size.x;
					}
					try{
						keyNeurona = Constructor.keyByCoord(index, test.red.box.y1);
						
						var valor;
						if 		((index % 3)==0) valor = Math.round(vColor[0]/255);
						else if ((index % 3)==1) valor = Math.round(vColor[1]/255);
						else if ((index % 3)==2) valor = Math.round(vColor[2]/255);

						test.red.neuronas[keyNeurona].activarExternal(valor );
					}catch(e){
						debugger;
					}
				}
			};
			
			Snap("#svgWorld").selectAll('.externo').forEach(function(externo){
			    printExterno(externo);
			});

		},
		debugPrintEntrada: function(){
			// TODO: para debuggear mockeo los ojos usando el motor
			var motor = test.world.context.motor;
			
			
			var keyNeurona;
			var valor;
			var indexInput = -1; //Para que arranque en 0 la primera
			
			//LEFT
			valor = motor[0];
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			
			
			
			//RIGHT
			valor = motor[1];
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			
			//UP
			valor = motor[2];
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			
			
			//DOWN
			valor = motor[3];
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
			test.red.neuronas[keyNeurona].activarExternal(valor);
			
		},
		addExterno: function(opt) {

			if(!opt)opt={};

			opt = $.extend(true, {}, {
				pos: {
					x: Math.round((Math.random() * $("#svgWorld").width())),
					y: Math.round((Math.random() * $("#svgWorld").height())),
				},
				color: "#AABBAA"
			}, opt);
			

			var snapWorld = Snap("#svgWorld");
			
			var externo = snapWorld.group(
				snapWorld.circle(0, 0, 30)
			);

			externo.attr({
				fill: opt.color,
				class: "externo"
			});


			externo.transform("T" + opt.pos.x + "," + opt.pos.y);
			
			
			return externo;

		},
		getColor: function(externo){

			var colorString = externo.attr('fill');
			
			colorString = colorString.replace('rgb(', '').replace(')','');
			
			return colorString.split(', ');
		}
	},
	onStep_vEventos: [],
	onStep: function(param){
		if(typeof param == "function"){
			this.onStep_vEventos.push(param);
		}else{
			$.each(this.onStep_vEventos, function(index, value){
				value(param);
			});
		}
	},
	step:function(){
		var test = this;
		
		test.world.step();
		//console.log('testeo world step');
		test.onStep();
	},
	play: function(){
		var test = this;
		
		if(!test.running){

			test.testInterval = setInterval(function (){
				test.step();
			}, 0);
			test.running = true;
		}
		
	},
	
	stop: function(){
		clearInterval(this.testInterval);
		test.running = false;
	},
	start: function (){
		var test =  this;
		
		
		test.world.load();
		
		
		//TODO: DEBUG: no estaría en el test world completo
		//test.graficoPatron();
		
	},
	graficoPatron: function (){
		
		var sizeCelda = 6;
		
		var test = this;
		
		var grafico = {
			x:1,
			y:1
		};
		
		//grafico la entrada
		var paper = Snap("#svgPatronesTest");
		var grupoCeldas = paper.g();
		
		for(var iEntrada = 0; iEntrada < test.patron.entrada.length; iEntrada++){
			
			var pos = {
				x: (grafico.x + iEntrada) * sizeCelda,
				y: (grafico.y + 0) * sizeCelda
			};
			
			var celda = paper.rect(pos.x, pos.y, sizeCelda, sizeCelda);
			var byteColor = Math.floor(test.patron.entrada[iEntrada] * 255);
			
			celda.attr({
				fill: "#" + byteColor.toString(16) + byteColor.toString(16) + byteColor.toString(16),
				stroke: "#550055"
			});
			
			grupoCeldas.add(celda);
			
			test.patron.mapaCelda[iEntrada] = celda;
			
			celda.click(function(e){
				
				
				var iEntrada = (Math.floor(this.node.x.baseVal.value / sizeCelda ) - grafico.x);
				
				
				if(test.patron.entrada[iEntrada] == 1){
					test.patron.entrada[iEntrada] = 0;
				}else{
					test.patron.entrada[iEntrada] = 1;
				}
				
				var byteColor = Math.floor(test.patron.entrada[iEntrada] * 255);
				this.attr({
					fill: "#" + byteColor.toString(16) + byteColor.toString(16) + byteColor.toString(16),
					stroke: "#550055"
				});


			});
			
		
		}
		
		grupoCeldas.attr({
			stroke: "#550055"
		});
	}
};