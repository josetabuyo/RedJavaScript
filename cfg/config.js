var config = {
    setConfig: function(key, value){
        this[key] = value;
        this.onSetConfg(key, value);
    },
    onSetConfg: function(key){
        return;
	},
    "COEF_SINAPSIS_ENTRENAMIENTO": 0,    
    "COEF_SINAPSIS_UMBRAL_PESO":  0.2,
    "COEF_NEURONA_UMBRAL_ACTIVACION":  0,
    "PESO_DENDRITA_CERCANA":  0.384,
    "PESO_DENDRITA_INHIBIDORA":  -0.400,
    "PESO_DENDRITA_ENTRADA":  1,
}

function debugCheckValue(valor, range){
			
    if(typeof(range) == "undefined"){
        range = [0, 1];
    }

    if(typeof(valor) == "-Infinity"
    || typeof(valor) == "Infinity"
    || typeof(valor) == "NaN"
    || valor < range[0]
    || valor > range[1]
    ){
        debugger;
    }
}