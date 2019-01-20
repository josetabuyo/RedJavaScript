presets = {
	
	lvq_audio: function(){
		console.log("Aplicando preset");
		console.log(this);



		var size = {
			x: 256,
			y: 2
		};


		//crear red
		red = Constructor.createRed({
			size: size
		});
		red.build();



		Constructor.insertarAxonesConMascara({
			mascara: conexionados.lvq
		});

		Constructor.eachNeurona({
			x0: 0,
			x1: size.x-1,
			y0: size.y-1,
			y1: size.y-1
		}, function (x,y,neurona){

			Constructor.makeEntradaNeurona(neurona);
		});

		

		$('#testSelector>select').val("TestAudio");
		$('#testSelector>select').click();
		
		
		guiRed.setLayer(0, red.neuronas);
		guiRed.refresh();
		

		console.log('red created...');
		
	}
}