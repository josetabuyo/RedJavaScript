
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

		if(dendrita.neurona == null){
			debugger
		}
		dendrita.neurona.dendritas[dendrita.id] = dendrita;

	}

	procesar (){
		var dendrita = this;

		var sinapsis = dendrita.sinapsis;

		var suma = 0.0;

		if(Object.keys(sinapsis).length > 0){

			for(var key in sinapsis){
				suma += sinapsis[key].procesar();
			}
			
			dendrita.valor = (suma / Object.keys(sinapsis).length) * dendrita.peso;

			debugCheckValue(dendrita.valor, [-1,1]);

			// dendrita.valor = (1 - (suma  / Object.keys(sinapsis).length)) * dendrita.peso;
		}

		return dendrita.valor;
	}

	entrenar (modulador){
		var dendrita = this;
		var sinapsis = dendrita.sinapsis;

		for(var key in sinapsis){
			var sinap = sinapsis[key];
			sinap.entrenar(modulador);
		}

	}

	delete_sinapsis (id){
		delete this.sinapsis[id];
		if(Object.keys(this.sinapsis).length == 0){
			this.kill();
		}
	}

  	kill (){
		this.neurona.delete_dendrita(this.id);
	}

};
