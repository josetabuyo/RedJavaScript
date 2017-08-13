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
			comida: null,
			flag_moverComida: false,
			motor: {
				left: 0,
				right: 0,
				up: 0,
				down: 0
			}
		},
		printEntrada: function(){
			
			
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
			
			
			
			
			
			
			var comida = test.world.context.comida;
			var bb = comida.getBBox();
			var rad = (bb.width / 2)
			
			
			var posComida = {
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
				x: (posAutomata.x - posComida.x),
				y: -(posAutomata.y - posComida.y)
			};
			
			
			var distancia = Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2));
			
			if(distancia > rad * 15) return; /// Estaría muy lejos, no lo vería
			
			
			var anguloOffset = Math.atan2(rad, distancia);
			
			
			var anguloCentro = Math.atan2(vec.x, vec.y);
			
			var anguloMax = anguloCentro + anguloOffset;
			var anguloMin = anguloCentro - anguloOffset;
			
			var pixelMax = Math.round((test.red.size.x / (2*Math.PI)) * anguloMax);
			var pixelMin = Math.round((test.red.size.x / (2*Math.PI)) * anguloMin);
			
			for(var i = pixelMin; i <= pixelMax; i++){
				var index = i;
				
				if((index < test.red.box.x0)) {
					index+= test.red.size.x;
				}else if((index > test.red.box.x1)) {
					index-= test.red.size.x;
				}
				
				try{
					keyNeurona = Constructor.keyByCoord(index, test.red.box.y1);
					test.red.neuronas[keyNeurona].activarExternal(1);
				}catch(e){
					debugger;
				}
			}
			
			
			
			
			
		},
		debugPrintEntrada: function(){
			// TODO: para debuggear mockeo los ojos usando el motor
			var motor = test.world.context.motor;
			
			
			var keyNeurona;
			var valor;
			var indexInput = -1; //Para que arranque en 0 la primera
			
			//LEFT
			valor = motor.left;
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
			valor = motor.right;
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
			valor = motor.up;
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
			valor = motor.down;
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
		load: function(){
			var world = this;
			
			var snapWorld = Snap("#svgWorld");
			
			var fondo = snapWorld.group(
				snapWorld.rect(0,0, $("#svgWorld").width(), $("#svgWorld").height())
			);
			fondo.attr({
				fill: "#FFFF88"
			});
			
			
			
			
			var automata = snapWorld.group(
				snapWorld.circle(0, 0, 15)
			);
			automata.attr({
				fill: "#FFA420"
			});
			automata.transform('T200,150');
			
			world.context.automata = automata;
			
			
			
			var comida = snapWorld.group(
				snapWorld.circle(0, 0, 15)
			);
			comida.attr({
				fill: "#668866"
			});
			comida.transform('T90,90');
			
			comida.click(function(){
				world.context.flag_moverComida = !world.context.flag_moverComida;
			});
			
			world.context.comida = comida;
			
			
			
			$('body').on('keydown', function(e){
				var motor = world.context.motor;
				
				switch (e.which) {
					case 37:
						motor.left = 1;
						e.preventDefault(); 
				break;
					case 38:
						motor.up = 1;
						e.preventDefault();
						break;
					case 39:
						motor.right = 1;
						e.preventDefault(); 
						break;
					case 40:
						motor.down = 1;
						e.preventDefault(); 
						break;
				};
				
				
			});
			
			
			$('body').on('keyup', function(e){
				var motor = world.context.motor;
				
				switch (e.which) {
					case 37:
						motor.left = 0;
						break;
					case 38:
						motor.up = 0;
						break;
					case 39:
						motor.right = 0;
						break;
					case 40:
						motor.down = 0;
						break;
				};
				
			});
			
		},
		step: function(){
			var paso = 8;
			
			var moverComida = function(){
				//mover los elementos del mundito: comida, enemigos, etc
				var comida = test.world.context.comida;
				
				var vel = {
					x: (Math.random() * 2) - 1,
					y: (Math.random() * 2) - 1
				};
				
				var bb = comida.getBBox();
				
				var pos = {
					x: (bb.x + (bb.width / 2)) + (vel.x * paso),
					y: (bb.y + (bb.height / 2)) + (vel.y * paso)
				};
				
				if(pos.x < 0) pos.x = 0;
				if(pos.y < 0) pos.y = 0;
				if(pos.x > $("#svgWorld").width()) pos.x = $("#svgWorld").width();
				if(pos.y > $("#svgWorld").height()) pos.y = $("#svgWorld").height();
				
				
				comida.transform( 'T' + pos.x + ',' + pos.y);
			};
			
			if(test.world.context.flag_moverComida){
				moverComida();
			}
			
			
			test.world.printEntrada();
			
			
			
			
			test.red.procesar();
			
			//TODO: obtener salidas, actualizar objeto motor
			
			
			
			// actualizar posición:
			var automata = test.world.context.automata;
			
			
			
			var motor = test.world.context.motor;
			
			var vel = {
				x: motor.right - motor.left,
				y: motor.down - motor.up
			};
			
			var bb = automata.getBBox();
			
			var pos = {
				x: (bb.x + (bb.width / 2)) + (vel.x * paso),
				y: (bb.y + (bb.height / 2)) + (vel.y * paso)
			};
			
			
			automata.transform( 'T' + pos.x + ',' + pos.y);
			
			
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