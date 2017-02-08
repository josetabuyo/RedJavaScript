/************** :TEST: ************/
var Test = function(opt){
	$.extend(this, {
		guiRed: null,
		entrada: null,
		salida: null,
		noise: true
	}, opt);
	
	if(!this.id){
		this.id = Math.random();
	}
	
	
	
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
				
				var keyNeurona = test.guiRed.keyByCoord(i, j);
				
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
			
			var keyNeuronaEntrada = test.guiRed.keyByCoord(x, y);
			test.red.neuronas[keyNeuronaEntrada].activarExternal(test.patron.entrada[index]);
			
			var keyNeuronaSalida = test.guiRed.keyByCoord(x, 0);
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
	
	keyPressDerecha: function(){
		this.offset++;
		
		if(this.offset >= this.red.size.x){
			this.offset = 0;
		}
		
	},
	keyPressIzquierda: function(){
		this.offset--;
		
		if(this.offset < 0){
			this.offset = this.red.size.x - 1;
		}
	},
	
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
				
				var keyNeurona = test.guiRed.keyByCoord(i, j);
				
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
				var keyNeurona = test.guiRed.keyByCoord(x, y);
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
				
				var keyNeurona = test.red.id + "x" + i + "y" + j;
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
	
	secada: function(){
		console.log('testeo con step secada');
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
		console.log('testeo con step debugEstandar');
		var test = this;
		
		test.printEntrada();
		
		test.red.procesar();
		
	},
	
	play: function(){
		var test = this;
		
		if(!test.running){
			test.testInterval = setInterval(function() {
				
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
		
		if(!test.step){
			test.step = test.desplazamientoConstante;
		}
		
		$(document).keydown(function(event) {
			if(event.which == 37){
				test.keyPressIzquierda();
			
			}else if(event.which == 39){
				test.keyPressDerecha();
			}
		});
		test.graficoPatron();
		
	},
	graficoPatron: function (){
			
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
				x: (grafico.x + iEntrada) * GuiRed.prototype.paso.x,
				y: (grafico.y + 0) * GuiRed.prototype.paso.y
			};
			
			var celda = paper.rect(pos.x, pos.y, GuiRed.prototype.paso.x, GuiRed.prototype.paso.y);
			var byteColor = Math.floor(test.patron.entrada[iEntrada] * 255);
			
			celda.attr({
				fill: "#" + byteColor.toString(16) + byteColor.toString(16) + byteColor.toString(16),
				stroke: "#550055"
			});
			
			grupoCeldas.add(celda);
			
			test.patron.mapaCelda[iEntrada] = celda;
			
			celda.click(function(e){
				
				
				var iEntrada = (Math.floor(this.node.x.baseVal.value / GuiRed.prototype.paso.x ) - grafico.x);
				
				
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