
/************** :NEURONA: ************/
var Neurona = function(opt){
	$.extend(this, {
		red: null,		// container
		axon: null,
		region: "INTERNA",
		id: null,
		dendritas: {},
		tensionSuperficial: 0

	}, opt);

	this.start();
};

Neurona.prototype = {
	start: function(){
		var neurona = this;

		neurona.axon = new Axon();
		neurona.axon.neurona = neurona;

		if(!neurona.valor){
			neurona.valor = Math.random();
		}
		neurona.red.neuronas[neurona.id] = neurona;
		neurona.red.neuronas_process[neurona.id] = neurona;
		neurona.red.regiones[neurona.region][neurona.id] = neurona;
	},

	setTension: function(tensionSuperficial){

		//Se normaliza la tensión superficial
		if(tensionSuperficial < -1.0){
			this.tensionSuperficial = -1.0;
		}else if(tensionSuperficial > 1.0){
			this.tensionSuperficial = 1.0;
		}else{
			this.tensionSuperficial = tensionSuperficial;
		}

	},
	activar: function(){

		if(this.tensionSuperficial > 0){
			this.valor = 1;
		}else{
			this.valor = 0;
		}
	},
	activarExternal: function(valor){
		var neurona = this;
		neurona.tensionSuperficial = valor;
		neurona.valor = valor;
	},
	procesar: function(){
		var neurona = this;



		var maxValorDendrita = 0.0;
		var minValorDendrita = 0.0;

		for(iDendrita in neurona.dendritas){
			var dendrita = neurona.dendritas[iDendrita];

			dendrita.procesar();

			if(maxValorDendrita < dendrita.valor){
				maxValorDendrita = dendrita.valor;
			}

			if(minValorDendrita > dendrita.valor){
				minValorDendrita = dendrita.valor;
			}

		};


		this.setTension(maxValorDendrita + minValorDendrita);

		for(iDendrita in neurona.dendritas){
			var dendrita = neurona.dendritas[iDendrita];

				this.entrenar(this.tensionSuperficial);

		};




	},
	procesarPromedio: function(){
		var neurona = this;


		var procesarDendritas = function(){

			var sumaValorDendritas = 0.0;

			for(iDendrita in neurona.dendritas){
				var dendrita = neurona.dendritas[iDendrita];

				dendrita.procesar();

				sumaValorDendritas += dendrita.valor;

			};

			if(neurona.dendritas.length > 0){
				return sumaValorDendritas / neurona.dendritas.length;
			}else{
				return 0
			}
		};


		var valorDendritas = procesarDendritas();


		neurona.setTension(valorDendritas);
	},
	entrenar: function(valor){
		var neurona = this;

		for(iDendrita in neurona.dendritas){
			neurona.dendritas[iDendrita].entrenar(valor);
		};
	}
};


var NeuronaEntrada = function(opt){
	Neurona.call(this, opt);

	neurona = this;

	neurona.region = "ENTRADA";
	red.regiones[neurona.region][neurona.id] = neurona;

	delete neurona.red.neuronas_process[neurona.id];

	neurona.dendritas = [];
	neurona.procesar = function(){};
	neurona.activar = function(){};
	neurona.entrenar = function(){};

}
