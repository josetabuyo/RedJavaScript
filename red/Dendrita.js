
/************** :DENDRITA: ************/
var Dendrita = function(opt){

	$.extend(this, {
		neurona: null,
		valor: 0.0,
		peso: 1.0,
		id: null,
		sinapsis:{}

	}, opt);

	this.start();
};

Dendrita.prototype = {
	start: function(){
		var dendrita = this;

		if(dendrita.id == null){
			dendrita.id = Object.keys(dendrita.neurona.dendritas).length+1;
		}

		dendrita.neurona.dendritas[dendrita.id] = dendrita;

	},
	procesar: function(){
		var dendrita = this;

		var sinapsis = dendrita.sinapsis;

		var valor;
		var suma = 0.0;
		
		if(Object.keys(sinapsis).length > 0){

			for(key in sinapsis){
				suma += sinapsis[key].procesar();
			}


			// Activacion Promedio
			valor = suma / Object.keys(sinapsis).length;
		}

		dendrita.valor = valor * dendrita.peso;

		return valor;
	},
	entrenar: function(modulador){
		var dendrita = this;
		var sinapsis = dendrita.sinapsis;


		// TODO: probar con
		// dendrita.neurona.tensionSuperficial - tensionDendrita;
		var meritoDentrita = dendrita.valor * modulador;


		if(Object.keys(sinapsis).length > 0){

			for(key in sinapsis){
				var sinap = sinapsis[key];

				sinap.entrenar(meritoDentrita);
			}

		}

	}
};
