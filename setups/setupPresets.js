presets = {
	default: function(){
		console.log("Aplicando preset");

		//crear red
		red = new Red();
		Constructor.red = red;

		Constructor.addNeuronasBox(
			{ x: 0, y: 0 },
			{ x: 64, y: 14 },
			{
				region: "SALIDA"
			}
		);

		Constructor.addNeuronasBox(
			{ x: 0, y: 15 },
			{ x: 64, y: 16 },
			{
				region: "ENTRADA"
			}
		);




    for(var keyNeurona in red.regiones["SALIDA"]){

      Constructor.insertarAxonesConMascara({
        keyNeurona: keyNeurona,
        mascara: conexionados.mini_feed_foward_inhibido
      });

    }

		guiRed.setLayer(0, red.neuronas);

		guiRed.refresh();


		//SET COEFICIENTES
		Sinapsis.prototype.COEF_SINAPSIS_ENTRENAMIENTO= 0.002;
		Sinapsis.prototype.COEF_SINAPSIS_UMBRAL_PESO= 0.2;

		console.log('red created...');

		console.log('ATTENTION!!!!!!!!');
		console.log('please select a test');

	},
	desa_audio: function(){
		console.log("Aplicando preset");

		//crear red
		red = new Red();
		Constructor.red = red;

		Constructor.addNeuronasBox(
			{ x: 0, y: 0 },
			{ x: 64, y: 5 },
			{
				region: "SALIDA"
			}
		);

		Constructor.addNeuronasBox(
			{ x: 0, y: 6 },
			{ x: 64, y: 7 },
			{
				region: "ENTRADA"
			}
		);




    for(var keyNeurona in red.regiones["SALIDA"]){

      Constructor.insertarAxonesConMascara({
        keyNeurona: keyNeurona,
        mascara: conexionados.mini_feed_foward_inhibido
      });

    }

		$('#testSelector>select').val("TestAudio");
		$('#testSelector>select').click();


		guiRed.setLayer(0, red.neuronas);

		guiRed.refresh();


		//SET COEFICIENTES
		Sinapsis.prototype.COEF_SINAPSIS_ENTRENAMIENTO= 0.002;
		Sinapsis.prototype.COEF_SINAPSIS_UMBRAL_PESO= 0.2;




		console.log('red created...');

	},

	lvq_audio: function(){
		console.log("Aplicando preset");

		//crear red
		red = new Red();
		Constructor.red = red;

		Constructor.addNeuronasBox(
			{ x: 0, y: 0 },
			{ x: 256, y: 0 },
			{
				region: "SALIDA"
			}
		);

		Constructor.addNeuronasBox(
			{ x: 0, y: 1 },
			{ x: 256, y: 1 },
			{
				region: "ENTRADA"
			}
		);




    for(var keyNeurona in red.regiones["SALIDA"]){

      Constructor.insertarAxonesConMascara({
        keyNeurona: keyNeurona,
        mascara: conexionados.lvq
      });

    }

		$('#testSelector>select').val("TestAudio");
		$('#testSelector>select').click();


		guiRed.setLayer(0, red.neuronas);

		guiRed.refresh();


		//SET COEFICIENTES
		Sinapsis.prototype.COEF_SINAPSIS_ENTRENAMIENTO= 0.002;
		Sinapsis.prototype.COEF_SINAPSIS_UMBRAL_PESO= 0.2;




		console.log('red created...');

	}
}


$(function(){
	//////////////////////////////////////// GUI PRESET /////////////////////////////////////

	$('#presets').on('click', function(){
		event.stopPropagation()
		$(this).find('select').show();

	});



	var $presets_select = $('#presets>select');


	keysPresets = Object.keys(presets);
	for(iTemplatePresets in keysPresets){
		$presets_select.append("<option value='" + keysPresets[iTemplatePresets] + "'>" + keysPresets[iTemplatePresets] + "</option>");
	}

	$presets_select.on('click', function(){

			presets[$(this).val()]();

		$(this).hide();
	});

	//////////////////////////////////////// GUI PRESET /////////////////////////////////////
});
