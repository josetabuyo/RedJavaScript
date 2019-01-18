/************** :RED: ************/
var Red = function(opt){
	$.extend(this, {
		size: {x:0,y:0},
		id: null,
		neuronas: {},
		vectorNeronas: [],
		entrada: {},
		salida: {}
	}, opt);
	
	this.start();
};


Red.prototype = {


	
	start: function(){
		var red = this;
		
		
		red.build();
		

		
		/*DEPRECATED*/
		/*Para mantener interfaz cómoda y común*/
		red.box = {
			x0: 0,
			x1: red.size.x - 1,
			y0: 0,
			y1: red.size.y - 1
		};
		/*DEPRECATED*/
		

	},
	build: function(){
		/*
		Se crean mapas de ordenamiento azaroso para luego ejecutar al azar entre los distintos mapas
		Gano ejecutar una sola vez la funcion Math.random() por cada paso de la red entera. QuickWin!
		*/
		
		var red = this;

		var compareRandom = function(a, b) {
		  return Math.random() - 0.5;
		};
		

		red.vectorNeronas = [];

		var keys = Object.keys(red.neuronas);

		for (key in keys){
			red.vectorNeronas.push(red.neuronas[keys[key]]);
		}


		red.mapaOrdenamiento = [];
		red.mapaOrdenamiento.push(red.vectorNeronas.sort(compareRandom));
		red.mapaOrdenamiento.push(red.vectorNeronas.sort(compareRandom));
		red.mapaOrdenamiento.push(red.vectorNeronas.sort(compareRandom));
		red.mapaOrdenamiento.push(red.vectorNeronas.sort(compareRandom));
		red.mapaOrdenamiento.push(red.vectorNeronas.sort(compareRandom));
		red.mapaOrdenamiento.push(red.vectorNeronas.sort(compareRandom));
		
	},
	procesar: function(){
		
		var red = this;
		
		var randomMapa = Math.floor((Math.random() * red.mapaOrdenamiento.length));
		
		for(iNeurona in red.mapaOrdenamiento[randomMapa]){
			red.mapaOrdenamiento[randomMapa][iNeurona].procesar();
		}
	}
}