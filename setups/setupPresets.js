presets = {
	test_automata_plane: function(){
		
		//crear red
		red = new Red();
		Constructor.red = red;
		
		let center = {x:0, y: 0};
		
		let stack_region_data = [
			{
				region: "SALIDA",
				height: 1,
				width: 30
			},
			{
				region: "INTERNA",
				height: 8,
				width: 30
			},
			{
				region: "ENTRADA",
				height: 1,
				width: 30
			},
		];
		

		var i_border_offset = 0;
		var sum_heigth = 0;

		for(region_data_index in stack_region_data){
			let region_data = stack_region_data[region_data_index];
			
			i_border_offset++;
			
			
			Constructor.addNeuronasBox(
				{
					x: center.x,
					y: center.y
						+ sum_heigth
						+ i_border_offset
				},
				{
					x: center.x 
						+ region_data.width,
					y: center.y
						+ sum_heigth
						+ region_data.height - 1
						+ i_border_offset
				},
				{
					region: region_data.region
				}
			);

			sum_heigth+=region_data.height-1;

		}

		Constructor.addNeuronasBox(
			{
				x: center.x - 2,
				y: center.y + 1
			},
			{
				x: center.x - 2,
				y: center.y
					+ sum_heigth
					+ i_border_offset
					
			},
			{
				region: "DOLOR"
			}
		);

		Constructor.eachNeuronaRegion("ENTRADA", function(neurona){
			Constructor.makeEntradaNeurona(neurona);			
		});

		Constructor.eachNeuronaRegion("DOLOR", function(neurona){
			Constructor.makeEntradaNeurona(neurona);
		});

		Constructor.conectarRegiones({peso: 1}, ["INTERNA", "SALIDA"]);
		Constructor.conectarRegiones({peso: 1}, ["ENTRADA", "INTERNA"]);
		
		
		Constructor.conectarRegiones({peso: -1}, ["DOLOR", "INTERNA"]);
		Constructor.conectarRegiones({peso: -1}, ["DOLOR", "SALIDA"]);
		

		var regiones = {...red.regiones["INTERNA"], ...red.regiones["SALIDA"]}
		for(var keyNeurona in regiones){

		  Constructor.insertarAxonesConMascara({
		    keyNeurona: keyNeurona,
		    mascara: conexionados.mini_feed_foward_inhibido
		  });

		}


		guiRed.setLayer(0, red.neuronas);

		guiRed.refresh();


		//SET COEFICIENTES
		config.setConfig("COEF_SINAPSIS_ENTRENAMIENTO", 0.001)
		config.setConfig("COEF_SINAPSIS_UMBRAL_PESO", 0.2)
		
		console.log("============ Configs ============");
		console.log(config);

		
		

		console.log('red created...');

		$('#tests select').val("TestAutomata");
		$('#tests select').change();


	},


	test_automata_square: function(){
		
		//crear red
		red = new Red();
		Constructor.red = red;

		
		let center = {x:30, y: 20}
		
		Constructor.addNeutonaBoxEmpty(
			10,
			0,
			center,
			{region: "ENTRADA"}
		);
		Constructor.addNeutonaBoxEmpty(
			6,
			3,
			center,
			{region: "INTERNA"}
		);
		Constructor.addNeutonaBoxEmpty(
			0,
			1,
			center,
			{region: "SALIDA"}
		);
		
		Constructor.conectarRegiones({peso: 1}, ["INTERNA", "SALIDA"]);
		

		for(var keyNeurona in red.regiones["INTERNA"]){

		  Constructor.insertarAxonesConMascara({
		    keyNeurona: keyNeurona,
		    mascara: conexionados.kohonen_simple
		  });

		}


		guiRed.setLayer(0, red.neuronas);

		guiRed.refresh();


		//SET COEFICIENTES
		config.setConfig("COEF_SINAPSIS_ENTRENAMIENTO", 0.002)
		config.setConfig("COEF_SINAPSIS_UMBRAL_PESO", 0.2)
		
		console.log("============ Configs ============");
		console.log(config);

		Constructor.conectarRegiones({peso: 1}, ["ENTRADA", "INTERNA"]);
		

		console.log('red created...');

		$('#tests select').val("TestAutomata");
		$('#tests select').change();


	},


	default: function(){

		//crear red
		red = new Red();
		Constructor.red = red;

		Constructor.addNeuronasBox(
			{ x: 20, y: 0 },
			{ x: 50, y: 30 },
			//{ x: 1, y: 1 },
			{
				region: "INTERNA"
			}
		);

		for(var keyNeurona in red.regiones["INTERNA"]){

		  Constructor.insertarAxonesConMascara({
		    keyNeurona: keyNeurona,
		    mascara: conexionados.kohonen_simple
		  });

		}
		
		guiRed.setLayer(0, red.neuronas);

		guiRed.refresh();
		
		//SET COEFICIENTES
		config.setConfig("COEF_SINAPSIS_ENTRENAMIENTO", 0.002)
		config.setConfig("COEF_SINAPSIS_UMBRAL_PESO", 0.2)
		
		console.log("============ Configs ============");
		console.log(config);

		console.log('red created...');

	},

	entrada_ascci: function(){

		//crear red
		red = new Red();
		Constructor.red = red;

		Constructor.addNeuronasBox(
			{ x: 0, y: 0 },
			{ x: 40, y: 20 },
			{
				region: "INTERNA"
			}
		);

		Constructor.addNeuronasBox(
			{ x: 0, y: 25 },
			{ x: 10, y: 35 },
			{
				region: "ENTRADA"
			}
		);


		for(var keyNeurona in red.regiones["INTERNA"]){

		  Constructor.insertarAxonesConMascara({
		    keyNeurona: keyNeurona,
		    mascara: conexionados.kohonen_simple
		  });

		}


		guiRed.setLayer(0, red.neuronas);

		guiRed.refresh();


		//SET COEFICIENTES
		config.setConfig("COEF_SINAPSIS_ENTRENAMIENTO", 0.002)
		config.setConfig("COEF_SINAPSIS_UMBRAL_PESO", 0.2)
		
		console.log("============ Configs ============");
		console.log(config);

		Constructor.conectarRegiones({peso: 1}, ["ENTRADA", "INTERNA"]);
		

		console.log('red created...');

		$('#tests select').val("TestAsciiImage");
		$('#tests select').change();


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
		config.setConfig("COEF_SINAPSIS_ENTRENAMIENTO", 0.002)
		config.setConfig("COEF_SINAPSIS_UMBRAL_PESO", 0.2)
		
		Constructor.conectarRegiones({peso: 1}, ["ENTRADA", "SALIDA"]);

		console.log('red created...');

		$('#tests select').val("TestAudio");
		$('#tests select').change();

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
		$('#tests select').change();


		guiRed.setLayer(0, red.neuronas);

		guiRed.refresh();

		//SET COEFICIENTES
		config.setConfig("COEF_SINAPSIS_ENTRENAMIENTO", 0.002)
		config.setConfig("COEF_SINAPSIS_UMBRAL_PESO", 0.2)
		
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

	$presets_select.on('change', function(){
		
		if($(this).val() != ""){
			console.log("Loading preset: " + $(this).val());
			$("#overlay").hide().show(0);
			presets[$(this).val()]();
			$("#overlay").hide();
			$(this).hide();
		}
	});

	//////////////////////////////////////// GUI PRESET /////////////////////////////////////
});
