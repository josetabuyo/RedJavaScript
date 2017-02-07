//grafico la entrada
var paper = Snap("#svgRed");

var GuiRed = function(opt){
	$.extend(this, {
		red: null,
		id: null,
		modo:"ACTIVACION",
		x: 0,
		y: 0,
		mapaNeuronaCelda: {}
		
	}, opt);
	
	
	if(!this.id){
		
		this.id = opt.red.id;
	}
	
	
	this.start();
};


GuiRed.prototype = {
	paso: {
		x: 6,
		y: 6
	},
	keyByPixelPos: function(pixelPosX, pixelPosY){
		var grafico = this;
		var x = (Math.floor(pixelPosX / grafico.paso.x ) - grafico.x);
		var y = (Math.floor(pixelPosY / grafico.paso.y ) - grafico.y);
		
		return grafico.keyByCoord(x, y);
	},
	keyByCoord: function(x, y){
		var grafico = this;
		
		var keyNeurona="";
		
		keyNeurona += grafico.red.id;
		keyNeurona += "x";
		keyNeurona += x ;
		keyNeurona += "y";
		keyNeurona += y ;
		
		return keyNeurona;
		
	},
	keyByIndex: function(index){
		var grafico = this;
		
		return keyNeurona = Object.keys(grafico.red.neuronas)[index];
		
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
				var pesoEfectivo = sinapsis.peso * dendrita.peso;
				if(pesoEfectivo>0){
					var color = Math.floor(pesoEfectivo * 200) + 55;
					grafico.mapaNeuronaCelda[sinapsis.id].attr({
						fill: "rgb(55, "+color+", 55)",
						stroke: "#005500"
					});
				}else{
					var color = Math.floor(Math.abs(pesoEfectivo) * 200) + 55;
					grafico.mapaNeuronaCelda[sinapsis.id].attr({
						fill: "rgb("+color+", 55, "+color+")",
						stroke: "#550055"
					});
				}
			}
		}
	},
	watch:{
		dendritas: {
			key: null
		}
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
				var keyNeurona = grafico.red.id + "x"+i+"y"+j;
				grafico.mapaNeuronaCelda[keyNeurona] = celda;
				
				celda.mousedown(function(e){
					
					var keyNeurona = grafico.keyByPixelPos(this.node.x.baseVal.value, this.node.y.baseVal.value);
					
					if (e.button === 2) {
						grafico.dendritasWatchByKey(keyNeurona);
						console.log(grafico.red.neuronas[keyNeurona]);
						
					}else{
						grafico.red.neuronas[keyNeurona].activarExternal(1);
						
						
					}
				});
				
				celda.mouseup(function(e){
					var keyNeurona = grafico.keyByPixelPos(this.node.x.baseVal.value, this.node.y.baseVal.value);
					
					if (e.button === 2) {
					}else{
						grafico.red.neuronas[keyNeurona].activarExternal(0);
					}
				});
			}
		}
		
		grupoCeldas.attr({
			stroke: "#550055"
		});
	},
	refresh: function(){
		var grafico = this;
		
		for(var i = 0; i < grafico.red.size.x; i++){
			for(var j = 0; j < grafico.red.size.y; j++){
				var keyNeurona = grafico.red.id + "x"+i+"y"+j;
				var celda = grafico.mapaNeuronaCelda[keyNeurona];
				var neurona = grafico.red.neuronas[keyNeurona];
				var axon = neurona.axon;
				
				//var byteColor = Math.floor(((axon.valor + 0.5) / 1.5) * 255);
				
				var valor;
				if(grafico.modo=="DEPOLARIZACION"){
					valor = neurona.tensionSuperficial;
				} else if(grafico.modo=="ACTIVACION"){
					valor = axon.valor;
				}
				
				var byteColor = Math.floor(valor * 255);
					
				
				if(neurona.tipo == "ENTRADA"){
					
					//No tengo valor de depolarización en la entrada, solo activación
					valor = axon.valor;
					var byteRojo = Math.floor(valor / 2 * 255);
					var byteVerde = Math.floor(valor / 2 * 255);
					var byteAzul = byteColor;
					
					celda.attr({
						fill: "#" + byteRojo.toString(16) + byteVerde.toString(16) + byteAzul.toString(16),
						stroke: "#550055"
					});
					
				}else if(neurona.tipo == "SALIDA"){
					
					var byteRojo = byteColor;
					var byteVerde = Math.floor(valor / 2 * 255);
					var byteAzul = Math.floor(valor / 2 * 255);
					
					celda.attr({
						fill: "#" + byteRojo.toString(16) + byteVerde.toString(16) + byteAzul.toString(16),
						stroke: "#550055"
						
					});
					
				}else{
					celda.attr({
						fill: "#" + byteColor.toString(16) + byteColor.toString(16) + byteColor.toString(16),
						stroke: "#550055"
					});
				}
				
				
				
				
			}
		}
		
		
		
	}
};

