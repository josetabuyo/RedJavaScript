/************** :RED: ************/
var Red = function(opt){
	$.extend(this, {
		size: {x:0,y:0},
		id: null,
		neuronas: {},
		neuronas_process: {},
		entrada: {},
		salida: {}
	}, opt);

	this.start();
};


Red.prototype = {



	start: function(){
		var red = this;


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
	procesar: function(){

		var red = this;

		for(iNeurona in red.neuronas_process){
			red.neuronas[iNeurona].procesar();
		}

		for(iNeurona in red.neuronas_process){
			red.neuronas[iNeurona].activar();
		}
	}
}
