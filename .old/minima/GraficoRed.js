//grafico la entrada
var paper = Snap("#pantallaSvg");

var GraficoRed = function(opt){
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


GraficoRed.prototype = {
	start: function (){
		var grafico = this;
		
		
		var grupoCeldas = paper.g();
		
		for(var i = 0; i < grafico.red.size.x; i++){
			for(var j = 0; j < grafico.red.size.y; j++){
				var pos = {
					x: grafico.x + (i * grafico.paso.x),
					y: grafico.y + (j * grafico.paso.y)
				};
				var celda = paper.rect(pos.x, pos.y, grafico.paso.x, grafico.paso.y);
				grupoCeldas.add(celda);
				
				grafico.mapaAxonesCelda[grafico.red.id + "x"+i+"y"+j] = celda;
				
				celda.mouseover(function(e){
					
					var claveAxon="";
					
					claveAxon += grafico.red.id;
					claveAxon += "x";
					claveAxon += (Math.floor((this.node.x.baseVal.value - grafico.x) / grafico.paso.x )) ;
					claveAxon += "y";
					claveAxon += (Math.floor((this.node.y.baseVal.value - grafico.y) / grafico.paso.y )) ;
					
					grafico.red.axones[claveAxon].set(1);
					
					
					
					this.attr({
						fill: "#ffffff"
					});
				});
				
				
				celda.mouseout(function(e){
					
					
					
					var claveAxon="";
					
					claveAxon += grafico.red.id;
					claveAxon += "x";
					claveAxon += (Math.floor((this.node.x.baseVal.value - grafico.x) / grafico.paso.x )) ;
					claveAxon += "y";
					claveAxon += (Math.floor((this.node.y.baseVal.value - grafico.y) / grafico.paso.y )) ;
					
					grafico.red.axones[claveAxon].set(0);
					
					this.attr({
						fill: "#aaaaaa"
					});
				});
				
			}
		}
		grupoCeldas.attr({
			fill: "#aaaaaa",
			stroke: "#000000",
			strokeWidth: 1
		});
	},
	refresh: function(){
		var grafico = this;
		
		for(var i = 0; i < grafico.red.size.x; i++){
			for(var j = 0; j < grafico.red.size.y; j++){
				var claveAxon = grafico.red.id + "x"+i+"y"+j;
				var celda = grafico.mapaAxonesCelda[claveAxon];
				var axon = grafico.red.axones[claveAxon];
				
				hexString = (Math.floor((axon.valor + 0.5)/1.5) * 255).toString(16);
				
				celda.attr({
					fill: "#" + hexString + hexString + hexString
				});
			
			}
		}
		
		
		
	}
};

