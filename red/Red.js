/************** :RED: ************/
var Red = function(opt){
	$.extend(this, {
		size: {x:0,y:0},
		id: null,
		neuronas: {}
	}, opt);
	
	this.start();
};


Red.prototype = {
	start: function(){
		var red = this;
		
		
		
		var vectorNeronas = [];
		
		if(Object.keys(red.neuronas).length == 0){
			
			for(var i = 0; i < red.size.x; i++){
				for(var j = 0; j < red.size.y; j++){
					
					var keyNeurona = "x"+i+"y"+j;
					
					var neurona = new Neurona({
						red: red,
						id: keyNeurona
					});
					
					red.neuronas[keyNeurona] = neurona;
					vectorNeronas.push(neurona);
					
				}
			}
		}
		
		
		
		/*
		Se crean mapas de ordenamiento azaroso para luego ejecutar al azar entre los distintos mapas
		Gano ejecutar una sola vez la funcion Math.random() por cada paso de la red entera. QuickWin!
		*/
		var compareRandom = function(a, b) {
		  return Math.random() - 0.5;
		};
		
		red.mapaOrdenamiento = [];
		red.mapaOrdenamiento.push(vectorNeronas.sort(compareRandom));
		red.mapaOrdenamiento.push(vectorNeronas.sort(compareRandom));
		red.mapaOrdenamiento.push(vectorNeronas.sort(compareRandom));
		red.mapaOrdenamiento.push(vectorNeronas.sort(compareRandom));
		red.mapaOrdenamiento.push(vectorNeronas.sort(compareRandom));
		red.mapaOrdenamiento.push(vectorNeronas.sort(compareRandom));
		
		
		
		/*Para mantener interfaz cómoda y común*/
		red.box = {
			x0: 0,
			x1: red.size.x - 1,
			y0: 0,
			y1: red.size.y - 1
		};
		

	},
	procesar: function(){
		
		var red = this;
		
		var randomMapa = Math.floor((Math.random() * red.mapaOrdenamiento.length));
		
		for(iNeurona in red.mapaOrdenamiento[randomMapa]){
			red.mapaOrdenamiento[randomMapa][iNeurona].procesar();
		}
	}
}