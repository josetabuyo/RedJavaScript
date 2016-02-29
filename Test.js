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
	neuronaCoordCurrent: null,
	neuronaCoordLast: null,
	testInterval: null,
	stop: function(){
		
		clearInterval(this.testInterval);
	},
	play: function(){
		var test = this;
		
		
		
		test.testInterval = setInterval(function() {
			
			if(test.neuronaCoordLast != null){
				//ENTRADA
				test.guiRed.axonSetByCoord(0,  test.neuronaCoordLast.x, test.guiRed.red.size.y - 1);
				//SALIDA
				test.guiRed.axonSetByCoord(0, test.neuronaCoordLast.x, 0);
			
			}
			
			if(test.neuronaCoordCurrent == null){
				test.neuronaCoordCurrent = {x:0, y: test.guiRed.red.size.y - 1};
			}
			
			
			//ENTRADA
			test.guiRed.axonSetByCoord(1,  test.neuronaCoordCurrent.x, test.guiRed.red.size.y - 1);
			//SALIDA
			test.guiRed.axonSetByCoord(1, test.neuronaCoordCurrent.x, 0);
				
			
			test.neuronaCoordLast = {
				x: test.neuronaCoordCurrent.x,
				y: test.neuronaCoordCurrent.y
			};
			
			test.neuronaCoordCurrent.x++;
			
			if(test.neuronaCoordCurrent.x >= test.guiRed.red.size.x){
				test.neuronaCoordCurrent.x = 0
			}
			
			test.guiRed.red.procesar();
			
		}, 100);

	}
};