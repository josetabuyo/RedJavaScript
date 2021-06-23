presets = {

	entrada_ascci: function(){




		console.log(`
			Setting preset: entrada_ascci
			=====================
					COEF_SINAPSIS_ENTRENAMIENTO = 0.002
					COEF_SINAPSIS_UMBRAL_PESO = 0.2

		`);



		//crear red
		red = new Red();
		Constructor.red = red;


		Constructor.addNeuronasBox(
			{ x: 0, y: 0 },
			{ x: 30, y: 20 },
			{
				region: "INTERNA"
			}
		);



		Constructor.addNeuronasBox(
			{ x: 0, y: 30 },
			{ x: 7, y: 37 },
			{
				region: "ENTRADA"
			}
		);


		for(var keyNeurona in red.regiones["INTERNA"]){

			Constructor.insertarAxonesConMascara({
				keyNeurona: keyNeurona,
				mascara: conexionados.kohonen_sparced
			});

		}


		guiRed.setLayer(0, red.neuronas);

		guiRed.refresh();


		//SET COEFICIENTES
		COEF_SINAPSIS_ENTRENAMIENTO= 0.002;
		COEF_SINAPSIS_UMBRAL_PESO= 0.2;


		Constructor.conectarRegiones(["ENTRADA", "INTERNA"]);






		console.log('red created...');


		console.log('ATTENTION!!!!!!!!');
		console.log('please select a test');


	},

	default: function(){




		console.log(`
			Setting preset: default
			=====================
					COEF_SINAPSIS_ENTRENAMIENTO = 0.002
					COEF_SINAPSIS_UMBRAL_PESO = 0.2

		`);



		//crear red
		red = new Red();
		Constructor.red = red;


		Constructor.addNeuronasBox(
			{ x: 0, y: 0 },
			{ x: 80, y: 40 },
			{
				region: "INTERNA"
			}
		);



		Constructor.addNeuronasBox(
			{ x: 0, y: 50 },
			{ x: 7, y: 57 },
			{
				region: "ENTRADA"
			}
		);


		for(var keyNeurona in red.regiones["INTERNA"]){

		  Constructor.insertarAxonesConMascara({
		    keyNeurona: keyNeurona,
		    mascara: conexionados.conexion_corona_kohonen
		  });

		}


		guiRed.setLayer(0, red.neuronas);

		guiRed.refresh();


		//SET COEFICIENTES
		COEF_SINAPSIS_ENTRENAMIENTO= 0.002;
		COEF_SINAPSIS_UMBRAL_PESO= 0.2;


		Constructor.conectarRegiones(["ENTRADA", "INTERNA"]);


		console.log('red created...');


		console.log('ATTENTION!!!!!!!!');
		console.log('please select a test');


	},
	desa_audio: function(){

		console.log(`
			Setting preset: desa_audio
			=====================
			Un mini_feed_foward_inhibido  en la region de SALIDA
			La entrada con el tamaño ideal para el test de audio
			Se selecciona el test TestAudio
					COEF_SINAPSIS_ENTRENAMIENTO = 0.002
					COEF_SINAPSIS_UMBRAL_PESO = 0.2
		`);



		//crear red
		red = new Red();
		Constructor.red = red;

		Constructor.addNeuronasBox(
			{ x: 0, y: 0 },
			{ x: 85, y: 10 },
			{
				region: "SALIDA"
			}
		);



		Constructor.addNeuronasBox(
			{ x: 10, y: 16 },
			{ x: 74, y: 17 },
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
		COEF_SINAPSIS_ENTRENAMIENTO= 0.002;
		COEF_SINAPSIS_UMBRAL_PESO= 0.2;


		Constructor.conectarRegiones(["ENTRADA", "SALIDA"]);




		console.log('red created...');

		$('#tests select').val("TestAudio");
		$('#tests select').click();

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

		$('#tests select').val("TestAudio");
		$('#tests select').click();


		guiRed.setLayer(0, red.neuronas);

		guiRed.refresh();


		//SET COEFICIENTES
		COEF_SINAPSIS_ENTRENAMIENTO= 0.002;
		COEF_SINAPSIS_UMBRAL_PESO= 0.2;




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

		$("#overlay").hide().show(0);


		presets[$(this).val()]();


		$("#overlay").hide();

		$(this).hide();

	});

	//////////////////////////////////////// GUI PRESET /////////////////////////////////////
});
