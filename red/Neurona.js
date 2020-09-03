
/************** :NEURONA: ************/
var Neurona = function(opt){
	$.extend(this, {
		red: null,		// container
		axon: null,
		tipo: "INTERNA",
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

		neurona.valor
		if(!neurona.valor){
			neurona.valor = Math.random();
		}
		neurona.red.neuronas[neurona.id] = neurona;

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

		if(this.tensionSuperficial > Axon.prototype.COEF_AXON_UMBRAL_SPIKE){
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

	neurona.tipo = "ENTRADA";

	neurona.red.entrada[neurona.id] = neurona;

	neurona.dendritas = [];
	neurona.procesar = function(){};
	neurona.activar = function(){};
	neurona.entrenar = function(){};

}
