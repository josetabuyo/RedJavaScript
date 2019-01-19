templates.presets = {
	
	audio_255x10: function(){
		
		//crear red
		red = Constructor.createRed({
			size: {
				x: 256,
				y: 10
			}
		});
		red.build();

		Constructor.insertarAxonesConMascara({
			mascara: templates.conexionado.mini_debug
		});


		Constructor.eachNeurona({
			x0: 0,
			x1: 255,
			y0: 9,
			y1: 9
		}, function (x,y,neurona){

			Constructor.makeEntradaNeurona(neurona);
		});

		

		$('#testSelector>select').val("TestAudio");
		$('#testSelector>select').click();
		
		
		guiRed.setLayer(0, red.neuronas);
		guiRed.refresh();
		

		console.log('red created...');
		
		setContext();
	}
}