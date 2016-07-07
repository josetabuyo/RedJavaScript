/************** :TEST: ************/
var Test = function(opt){
	$.extend(this, {
		guiRed: null
	}, opt);
	
	if(!this.id){
		this.id = Math.random();
	}
	
	this.start();
};

Test.prototype = {
	start: function (){
	},
	estado: {
		current:	{
			neuronaCoord: {x:null, y:null}
		}
	},
	patron: {
		entrada: [0,1,0,1,1,1,0,0,1,1,1,0,1,0],
		salida: [0,1,0,1,1,1,0,0,1,1,1,0,1,0]
	},
	testInterval: null,
	
	stop: function(){
		
		clearInterval(this.testInterval);
	},
	step: function(){
		var test = this;
		
		var testIndex =  test.estado.current.neuronaCoord.x;
			
		if(testIndex == null){
			testIndex = 0;
			test.estado.current.neuronaCoord = {x: testIndex, y: test.guiRed.red.size.y - 1};
		}
		
		for(var iEntrada = 0; iEntrada < test.patron.entrada.length; iEntrada++){
			var x = testIndex - iEntrada;
			var y = test.guiRed.red.size.y - 1;
			
			if(x < 0){
				x = test.guiRed.red.size.x + x;
			}
			
			var index = test.patron.entrada.length - 1 - iEntrada;
			
			test.guiRed.axonSetByCoord(test.patron.entrada[index],  x, y);
			test.guiRed.axonSetByCoord(test.patron.salida[index],  x, 0);
			
		}
		
		
		
		test.estado.current.neuronaCoord.x++;
		if(test.estado.current.neuronaCoord.x >= test.guiRed.red.size.x){
			test.estado.current.neuronaCoord.x = 0;
		}
		
		
		
		
		test.guiRed.red.procesar();
	},
	play: function(){
		var test = this;
		
		test.testInterval = setInterval(function() {
			
			test.step();
			
		}, 100);

	}
};