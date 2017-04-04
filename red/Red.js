/************** :RED: ************/
var Red = function(opt){
	$.extend(this, {
		size: {x:0,y:0},
		id: null,
		neuronas: {}
	}, opt);
	
	
	if(!this.id){
		this.id = Math.random();
	}
	
	this.start();
};


Red.prototype = {
	COEF_UMBRAL_SINAPSIS_PESO: 0.200,
	start: function(){
		var red = this;
		
		if(Object.keys(red.neuronas).length == 0){
			
			for(var i = 0; i < red.size.x; i++){
				for(var j = 0; j < red.size.y; j++){
					
					var keyNeurona = red.id + "x"+i+"y"+j;
					
					var neurona = new Neurona({
						red: red,
						id: keyNeurona
					});
					
					red.neuronas[keyNeurona] = neurona;
				}
			}
		}
		
		/*Para mantener interfaz cómoda y común*/
		red.box = {
			x0: 0,
			x1: red.size.x - 1,
			y0: 0,
			y1: red.size.y - 1
		};
	},
	
	play: function(){
		var red = this;
		
		this.playInterval = setInterval(function() {
			red.procesar();
		}, 0);

	},
	stop: function(){
		clearInterval(this.playInterval);
	},
	procesar: function(){
		
		var red = this;
		
		for(key in red.neuronas){
			red.neuronas[key].procesar();
		}
		
		red.onProcesar();
	
	},
	onProcesar_vEventos: [],
	onProcesar: function(param){
		if(typeof param == "function"){
			this.onProcesar_vEventos.push(param);
		}else{
			$.each(this.onProcesar_vEventos, function(index, value){
				value(param);
			});
		}
	}
}