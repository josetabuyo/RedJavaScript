
/************** :DENDRITA: ************/

class Dendrita {
  constructor(opt) {

		$.extend(this, {
			neurona: null,
			valor: 0.0,
			peso: 1.0,
			id: null,
			sinapsis:{}

		}, opt);

		var dendrita = this;

		if(dendrita.id == null){

			try {
				dendrita.id = Object.keys(dendrita.neurona.dendritas).length+1;
			} catch (e) {
				dendrita.id = 0
			}

		}

		dendrita.neurona.dendritas[dendrita.id] = dendrita;

	}

	procesar (){
		var dendrita = this;

		var sinapsis = dendrita.sinapsis;

		var valor;
		var suma = 0.0;

		if(Object.keys(sinapsis).length > 0){

			for(var key in sinapsis){
				suma += sinapsis[key].procesar();
			}

		}


    try{
      dendrita.valor = (1 - (suma  / Object.keys(sinapsis).length)) * window[dendrita.peso];
    } catch {
      dendrita.valor = (1 - (suma  / Object.keys(sinapsis).length)) * dendrita.peso;
    }



		return dendrita.valor;
	}

	entrenar (modulador){
		var dendrita = this;
		var sinapsis = dendrita.sinapsis;


		var meritoDentrita = dendrita.valor * modulador;



		if(Object.keys(sinapsis).length > 0){

			for(var key in sinapsis){
				var sinap = sinapsis[key];

				sinap.entrenar(meritoDentrita);

      }

		} else {
      this.kill;
    }

	}



  kill (){
		delete this.neurona[this.id];
	}

};
