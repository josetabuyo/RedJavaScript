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
	NOISE_LEVEL: 0.2,
	estado: {
		current:	{
			neuronaCoord: {x:null, y:null}
		}
	},
	patron: {
		entrada: [0,0,0,1,1,1,0,0,1,1,1,0,0,0],
		salida: [0,0,0,0,0,1,1,1,1,0,0,0,0,0]
	},
	testInterval: null,
	
	stop: function(){
		
		clearInterval(this.testInterval);
	},
	
	
	desplazamientoConstante: function(){
		var test = this;
		
		var testIndex =  test.estado.current.neuronaCoord.x;
			
		if(testIndex == null){
			testIndex = Math.round(test.guiRed.red.size.x / 2);
			test.estado.current.neuronaCoord = {x: testIndex, y: test.guiRed.red.size.y - 1};
		}
		
		
		
		if(test.noise){
			for(var i = test.entrada.box.x0; i <= test.entrada.box.x1; i++){
				for(var j = test.entrada.box.y0; j <= test.entrada.box.y1; j++){
					
					test.guiRed.axonSetByCoord(Math.random() * 0.3,  i, j);
					
				}
			}
		}
		
		
		
		
		
		for(var iEntrada = 0; iEntrada < test.patron.entrada.length; iEntrada++){
			var x = testIndex - iEntrada;
			var y = test.guiRed.red.size.y - 1;
			
			if(x < 0){
				x = test.guiRed.red.size.x + x;
			}
			
			var index = test.patron.entrada.length - 1 - iEntrada;
			
			test.guiRed.axonSetByCoord(test.patron.entrada[index],  x, y);
			test.guiRed.axonSetByCoord(test.patron.salida[index],  x, 0);
			
		}
		
		
		
		test.estado.current.neuronaCoord.x++;
		if(test.estado.current.neuronaCoord.x >= test.guiRed.red.size.x){
			test.estado.current.neuronaCoord.x = 0;
		}
		
		
		
		
		test.guiRed.red.procesar();
	},
	
	foco: null,
	secada: function(){
		console.log('testeo con step secada');
		var test = this;
		
		
		if(!test.foco){
			test.foco = test.guiRed.red.size.x / 2;
		}
		
		for(var i = test.entrada.box.x0; i <= test.entrada.box.x1; i++){
			for(var j = test.entrada.box.y0; j <= test.entrada.box.y1; j++){
				var valor = 0;
				
				if(test.noise){
					valor = Math.random() * test.NOISE_LEVEL;
				}else{
					valor = 0;
				}
				test.guiRed.axonSetByCoord(valor, i, j);
				
			}
		}
		
		
		for(var iEntrada = 0; iEntrada < test.patron.entrada.length; iEntrada++){
			var x = test.foco - iEntrada + Math.round(test.patron.entrada.length / 2);
			var y = test.guiRed.red.size.y - 1;
			
			if(x < 0){
				x = x + test.guiRed.red.size.x;
			}
			
			if(x > test.guiRed.red.size.x - 1){
				x = x - test.guiRed.red.size.x;
			}
			

			var index = test.patron.entrada.length - 1 - iEntrada;
			try{
				test.guiRed.axonSetByCoord(test.patron.entrada[index],  x, y);
			}catch(e){
				debugger;
			}
			
		}
		
		
		
		
		test.guiRed.red.procesar();
		
		
		//tomo el centro de masa (x,y) de la salida 
		var sumaTension = 0.0;

		var sumaProducto = {
			x: 0.0,
			y: 0.0
		};

		for(var i = test.salida.box.x0; i <= test.salida.box.x1; i++){
			for(var j = test.salida.box.y0; j <= test.salida.box.y1; j++){
				
				var keyNeurona = test.salida.red.id + "x" + i + "y" + j;
				var neurona = test.salida.red.neuronas[keyNeurona];
				
				sumaTension += neurona.tensionSuperficial;
				sumaProducto.x += neurona.tensionSuperficial * (i+1);
				sumaProducto.y += neurona.tensionSuperficial * (j+1);
				
				if(neurona.tensionSuperficial > 1){
					// DEBUG: no debería pasar esto
					debugger;
				}
				
				
				if(sumaTension > test.salida.box.x1){
					// DEBUG: no debería pasar esto
					debugger;
				}

				if(sumaTension > sumaProducto.x){
					// DEBUG: no debería pasar esto
					debugger;
				}
				

			}
		}
		
		var mediaX = sumaProducto.x / sumaTension * 1.0;
		
		
		
		//ubico el foco en la media.x de la salida
		test.foco = Math.round(mediaX);
		if(!test.foco){
			test.foco = 0;
		}
		
		
	},
	
	
	play: function(){
		var test = this;
		
		test.testInterval = setInterval(function() {
			
			test.step();
			
		}, 100);

	},
	
	start: function (){
		if(!this.step){
			this.step = this.desplazamientoConstante;
		}
	}
};