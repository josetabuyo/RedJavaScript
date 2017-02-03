
/************** :ENTRADA: ************/
var Entrada = function(opt){
	$.extend(this, {
		size: {x:0,y:0},
		id: null,
		axones: {}
	}, opt);
	
	if(!this.id){
		this.id = Math.random();
	}
	
	this.start();
};

Entrada.prototype = {
	start: function (){
		var entrada = this;
		
		for(var i = 0; i < entrada.size.x; i++){
			
			for(var j = 0; j < entrada.size.y; j++){
				
				var claveAxon = entrada.id + "x" + i + "y" + j;
				
				var axon = new Axon({
					id: claveAxon
				});
				
				entrada.axones[claveAxon] = axon;
			}
		}
	}
};