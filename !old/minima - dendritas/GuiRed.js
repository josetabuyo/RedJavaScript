//grafico la entrada
var paper = Snap("#pantallaSvg");

var GuiRed = function(opt){
	$.extend(this, {
		red: null,
		id: null,
		x: 0,
		y: 0,
		mapaAxonesCelda: {},
		paso: {
			x: 10,
			y: 10
		}
	}, opt);
	
	
	if(!this.id){
		
		this.id = opt.red.id;
	}
	
	
	this.start();
};


GuiRed.prototype = {
	axonSetByPixelPos: function(valor, pixelPosX, pixelPosY){
		var grafico = this;
		
		
		var x = (Math.floor(pixelPosX / grafico.paso.x ) - grafico.x);
		var y = (Math.floor(pixelPosY / grafico.paso.y ) - grafico.y);
		
		grafico.axonSetByCoord(valor, x, y);
		
	},
	axonSetByCoord: function(valor, x, y){
		var grafico = this;
		
		var keyAxon="";
		
		keyAxon += grafico.red.id;
		keyAxon += "x";
		keyAxon += x ;
		keyAxon += "y";
		keyAxon += y ;

		grafico.axonSetByKey(valor, keyAxon);


	},
	axonSetByIndex: function(valor, index){
		var grafico = this;

		var keyAxon = Object.keys(grafico.red.axones)[index];
		
		grafico.axonSetByKey(valor, keyAxon);
		
	},
	axonSetByKey:function(valor, keyAxon){
		var grafico = this;
		
		grafico.red.axones[keyAxon].set(valor);
		
		if(valor>0){
			grafico.mapaAxonesCelda[keyAxon].attr({
				fill: "#ffffff"
			});
			red.procesar();
		}else{
			grafico.mapaAxonesCelda[keyAxon].attr({
				fill: "#101010"
			});
		}
	},
	
















	dendritasWatchByPixelPos: function(pixelPosX, pixelPosY){
		var grafico = this;
		
		
		var x = (Math.floor(pixelPosX / grafico.paso.x ) - grafico.x);
		var y = (Math.floor(pixelPosY / grafico.paso.y ) - grafico.y);
		
		grafico.dendritasWatchByCoord(x, y);
		
	},
	dendritasWatchByCoord: function(x, y){
		var grafico = this;
		
		var keyNeurona="";
		
		keyNeurona += grafico.red.id;
		keyNeurona += "x";
		keyNeurona += x ;
		keyNeurona += "y";
		keyNeurona += y ;

		grafico.dendritasWatchByKey(keyNeurona);


	},
	dendritasWatchByKey:function(keyNeurona){
		var grafico = this;
		var dendritas = grafico.red.neuronas[keyNeurona].dendritas;
		
		for(keyDendrita in dendritas){
			var dendrita = dendritas[keyDendrita];
			
			for(keySinapsis in dendrita.sinapsis){
				
				var sinapsis = dendrita.sinapsis[keySinapsis];
				
				//TODO: parche, porque no grafico sinapsis a otros Graficos
				if(sinapsis.axon.id.substring(0,5) == keyNeurona.substring(0,5)){
					var color = Math.floor(sinapsis.peso * 200) + 55;
					grafico.mapaAxonesCelda[sinapsis.axon.id].attr({
						fill: "rgb(55, "+color+", 55)"
					});
				}
			}
		}
	},
	testAxonIndexCurrent: null,
	testAxonIndexLast: null,
	testInterval: null,
	testStop: function(){

		clearInterval(this.testInterval);
	},
	testPlay: function(){
		var grafico = this;
		
		
		
		this.testInterval = setInterval(function() {
			
			if(grafico.testAxonIndexLast != null){
				grafico.axonSetByIndex(0, grafico.testAxonIndexLast);
				//TODO: DEBUG: target
				//salida.mapaNeuronaTarget[grafico.testAxonIndexLast] = 0;
			}
			
			if(grafico.testAxonIndexCurrent == null){
				grafico.testAxonIndexCurrent = 0
			}
			
			grafico.axonSetByIndex(1, grafico.testAxonIndexCurrent);
			//TODO: DEBUG: target
			//salida.target[grafico.testAxonIndexCurrent] = 1;
			
			grafico.testAxonIndexLast = grafico.testAxonIndexCurrent;
			grafico.testAxonIndexCurrent++;

			
			if(grafico.testAxonIndexCurrent >= Object.keys(grafico.red.axones).length){
				grafico.testAxonIndexCurrent = 0
			}
			
			red.procesar();
			
		}, 100);

	},
	start: function (){
		var grafico = this;
		
		
		var grupoCeldas = paper.g();
		
		for(var i = 0; i < grafico.red.size.x; i++){
			for(var j = 0; j < grafico.red.size.y; j++){
				var pos = {
					x: (grafico.x + i) * grafico.paso.x,
					y: (grafico.y + j) * grafico.paso.y
				};
				var celda = paper.rect(pos.x, pos.y, grafico.paso.x, grafico.paso.y);
				grupoCeldas.add(celda);
				var keyAxon = grafico.red.id + "x"+i+"y"+j;
				grafico.mapaAxonesCelda[keyAxon] = celda;
				
				
				celda.mousedown(function(e){
					if (e.button === 2) {
						grafico.dendritasWatchByPixelPos(this.node.x.baseVal.value, this.node.y.baseVal.value);
					}else{
						grafico.axonSetByPixelPos(1, this.node.x.baseVal.value, this.node.y.baseVal.value);
					}
				});
				celda.mouseup(function(e){
					grafico.axonSetByPixelPos(0, this.node.x.baseVal.value, this.node.y.baseVal.value);
				});
				/*
				celda.mouseover(function(e){
					
					grafico.axonSetByPixelPos(1, this.node.x.baseVal.value, this.node.y.baseVal.value);
					
				});
				*/
				/*celda.mouseout(function(e){
					
					grafico.axonSetByPixelPos(0, this.node.x.baseVal.value, this.node.y.baseVal.value);
					
				});
				*/
			}
		}
		
		grupoCeldas.attr({
			stroke: "#550055",
			strokeWidth: 1
		});
	},
	refresh: function(){
		var grafico = this;
		
		for(var i = 0; i < grafico.red.size.x; i++){
			for(var j = 0; j < grafico.red.size.y; j++){
				var keyAxon = grafico.red.id + "x"+i+"y"+j;
				var celda = grafico.mapaAxonesCelda[keyAxon];
				var axon = grafico.red.axones[keyAxon];
				
				hexString = (Math.floor((axon.valor + 0.5)/1.5) * 255).toString(16);
				
				celda.attr({
					fill: "#" + hexString + hexString + hexString
				});
			
			}
		}
		
		
		
	}
};

