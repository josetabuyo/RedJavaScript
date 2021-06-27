/************** :NEURONA: ************/

class Neurona {
  constructor(opt) {

		$.extend(this, {
			region: "INTERNA",
			id: null,
			dendritas: {},
			tensionSuperficial: 0,
			axon:{
				sinapsis: {}
			}

		}, opt);

		var neurona = this;

		if(!neurona.valor){
			neurona.valor = Math.random();
		}
		neurona.red.neuronas[neurona.id] = neurona;
		neurona.red.neuronas_process[neurona.id] = neurona;
		neurona.red.regiones[neurona.region][neurona.id] = neurona;



	}

	setTension (tensionSuperficial) {

		//Se normaliza la tensión superficial
		if(tensionSuperficial < -1.0){
			this.tensionSuperficial = -1.0;
		}else if(tensionSuperficial > 1.0){
			this.tensionSuperficial = 1.0;
		}else{
			this.tensionSuperficial = tensionSuperficial;
		}

	}
	activar () {
    // this.valor = this.tensionSuperficial * COEF_NEURONA_UMBRAL_ACTIVACION;
		if(this.tensionSuperficial > COEF_NEURONA_UMBRAL_ACTIVACION){
			this.valor = 1;
		}else{
			this.valor = 0;
		}


	}
	activarExternal (valor){
		var neurona = this;
		neurona.tensionSuperficial = valor;
		neurona.valor = valor;
	}


  procesar (){
    // tipo "fuzzy logic":
    // entre las sinapsis, siempre, una AND fuzzy, dentro de la dendrita
    // entre las dendritas, en este caso, una OR fuzzy que compite las dendritas negativas contra las poositivas, dentro de la neurona
    //   gana la más grande en módulo.
    //  se setea el valor de la diferencia entre minValorDendrita y maxValorDendrita.

    var neurona = this;



    var maxValorDendrita = 0.0;
    var minValorDendrita = 0.0;
    var dendritaMax;
    var dendritaMin;





    for(var iDendrita in neurona.dendritas){
      var dendrita = neurona.dendritas[iDendrita];

      dendrita.procesar();

      if(maxValorDendrita < dendrita.valor){
        maxValorDendrita = dendrita.valor
        dendritaMax = dendrita;
      }

      if(minValorDendrita > dendrita.valor){
        minValorDendrita = dendrita.valor;
        dendritaMin = dendrita;
      }

    };


    var valor = maxValorDendrita + minValorDendrita;

    if(valor > 0){
      neurona.setTension(maxValorDendrita);
      dendritaMax.entrenar(1);
    } else if (valor < 0) {
      neurona.setTension(minValorDendrita);
      dendritaMin.entrenar(1);
    } else {
      neurona.setTension(valor);
    }


  }



	procesarPromedio (){
		var neurona = this;


		var procesarDendritas = function(){

			var sumaValorDendritas = 0.0;

			for(var iDendrita in neurona.dendritas){
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
	}
  procesarOld (){
		var neurona = this;



		var maxValorDendrita = 0.0;
		var minValorDendrita = 0.0;



		for(var iDendrita in neurona.dendritas){
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

		for(var iDendrita in neurona.dendritas){
			var dendrita = neurona.dendritas[iDendrita];

			dendrita.entrenar(this.tensionSuperficial);

		};

	}



  entrenar (valor){
		var neurona = this;

    if(Object.keys(neurona.dendritas).length > 0){
      for(var iDendrita in neurona.dendritas){
  			neurona.dendritas[iDendrita].entrenar(valor);
  		};
    }else{

      this.kill;

    }

	}

  kill (){
    delete this.red.neuronas[this.id];
  }

}



class NeuronaEntrada extends Neurona{
  constructor (opt) {

		super(opt);


		$.extend(this, {
			region: "ENTRADA",
			dendritas: {}
		}, opt);


		var neurona = this;

		neurona.red.regiones[neurona.region][neurona.id] = neurona;

		delete neurona.red.neuronas_process[neurona.id];
		neurona.dendritas = [];


	}
}
