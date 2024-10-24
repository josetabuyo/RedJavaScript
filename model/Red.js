/************** :RED: ************/
class Red {
  constructor(opt) {

		$.extend(this, {
			size: {x:0,y:0},
			id: null,
			neuronas: {},
			neuronas_process: {},
			regiones: {},
			salida: {}
		}, opt);

		var red = this;


		red.regiones["ENTRADA"] = {}
		red.regiones["SALIDA"] = {}
		red.regiones["INTERNA"] = {}
		red.regiones["DOLOR"] = {}

		/*DEPRECATED*/
		/*Para mantener interfaz cómoda y común*/
		red.box = {
			x0: 0,
			x1: red.size.x - 1,
			y0: 0,
			y1: red.size.y - 1
		};
		/*DEPRECATED*/


	}

	procesar (){

		var red = this;

		for(var iNeurona in red.neuronas_process){
			red.neuronas[iNeurona].procesar();
		}

		for(var iNeurona in red.neuronas_process){
			red.neuronas[iNeurona].activar();
		}
	}
}
