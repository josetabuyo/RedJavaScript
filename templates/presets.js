presets = {
	desa: function(){
		console.log("Aplicando preset");
		console.log(this);


		var size = {
			x: 32,
			y: 16
		};


		//crear red
		red = new Red();
		red = Constructor.addNeuronas({
			size: size
		});




		Constructor.insertarAxonesConMascara({
			mascara: conexionados.mini_feed_foward_inhibido
		});

		Constructor.eachNeurona({
			x0: 0,
			x1: size.x-1,
			y0: size.y-2,
			y1: size.y-1
		}, function (x,y,neurona){

			Constructor.makeEntradaNeurona(neurona);
		});



		$('#testSelector>select').val("TestAudio");
		$('#testSelector>select').click();


		guiRed.setLayer(0, red.neuronas);

		guiRed.refresh();


		//SET COEFICIENTES
		Axon.prototype.COEF_AXON_UMBRAL_SPIKE= 0.158;
		Axon.prototype.COEF_AXON_ANCHO_PULSO= 4;
		Sinapsis.prototype.COEF_SINAPSIS_ENTRENAMIENTO_DEFAULT= 0.002;
		Sinapsis.prototype.COEF_SINAPSIS_ENTRENAMIENTO= 0.002;
		Sinapsis.prototype.COEF_SINAPSIS_UMBRAL_PESO= 0.2;




		console.log('red created...');

	},
	lvq_audio: function(){
		console.log("Aplicando preset");
		console.log(this);



		var size = {
			x: 256,
			y: 2
		};


		//crear red
		red = new Red();
		red = Constructor.addNeuronas({
			size: size
		});

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
