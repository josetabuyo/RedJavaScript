$(function(){

	$('body').append(`
		<style>
			#guiRed_Container{
				position: absolute;
				left: 50%;
				top: 0%;
				right: 0%;
				bottom: 0%;
				overflow: hidden;
				border: solid 3px;
				border-color: violet;
			}
			#guiRed_Container #load select{
				display: none;
			}

			#guiRed_Container .body{
				overflow: scroll;
			}


			#control {
				border: solid 1px Purple;

				position: absolute;
				left: 0%;
				top: 70%;
				width: 50%;
				bottom: 0%;

				background-color: black;

			}


			#control li {
				font-size: 10px;
				color: white;
			}
		</style>




		<div id="guiRed_Container"  class="guiMatrix container">
			<div class="toolbar">
				<div id="addNeurona" class="boton" title="Agregar neuronas">
					N
				</div>
				<div id="conectar" class="boton" title="Conectar neuronas">
					C
				</div>
				<div id="watchConexiones" class="boton" title="Ver las conexiones de la neurona seleccionada">
					W
				</div>

				<div id="presets" class="boton" title="Cargar una preset">
					Pr
					<select>
						<option value=""></option>
					</select>
				</div>
				<div id="loadRed" class="boton"  title="Carga una red guardada en un json. (se requiere FileBackend: un nodo Vortex corriendo en un node.js)">
					Lo
				</div>
				<div id="saveRed" class="boton" title="Guarda el estado de la red en un json. (se requiere FileBackend: un nodo Vortex corriendo en un node.js)">
					Sa
				</div>



				<div class="maximize boton botonLeft" title="Maximizar">
				#
				</div>
				<div class="zoomOut boton botonLeft" title="Zoom -">
				-
				</div>
				<div class="zoomIn boton botonLeft" title="Zoom +">
					+
				</div>
			</div>
			<div id="toolbarInfo">
			</div>

			<div class="body">
				<svg id="guiRed_svg" width="10000px" height="10000px" >
				</svg>
			</div>

		</div>

	`);



	//GLOBAL
	red = new Red();
	Constructor.red = red;


	guiRed = new GuiMatriz({
		idSvg: 'guiRed_svg',
		showCero: true,
		x: 10,
		y: 10,
		escala: {
			x: 7,
			y: 7
		},
		tool1: "addCell",
		tool2: "removeCell",
		onAddCell: function(key){
			var gui = this;
			Constructor.addNeurona({
				red: red,
				id: key,
				region: gui.region
			});

			var cel = gui.layers[gui.sel.idLayer].cels[key];

			gui.onRefreshCell(key, cel.svgObject);


		},
		onRemoveCell: function(key){

			delete red.regiones[red.neuronas[key].region][key];
			delete red.neuronas_process[key];
			delete red.neuronas[key];

		},
		onRefreshCell: function(key, svgObject){
			var gui = this;

			var valor;
			var cel = gui.layers[gui.sel.idLayer].cels[key];
			var neurona = red.neuronas[key];

			valor = neurona.valor;

			var byteColorHigth = ("0" + Math.floor(valor * 255).toString(16)).slice(-2); ;
			var byteColorLow = "00";

			var byteRojo = byteColorHigth;
			var byteVerde = byteColorHigth;
			var byteAzul = byteColorHigth;

			// DEFAULT
			svgObject.attr({
				fill: "#" + byteRojo + byteVerde + byteAzul,
				stroke: $('#region_' + neurona.region).css('color')
			});


			if(neurona.region == "SALIDA"){
				var byteVerde = byteColorLow;
				var byteAzul = byteColorLow;
				svgObject.attr({
					fill: "#" + byteRojo + byteVerde + byteAzul
				});
			}

			if(neurona.region == "ENTRADA"){

				var byteRojo = byteColorLow;
				var byteVerde = byteColorLow;

				svgObject.attr({
					fill: "#" + byteRojo + byteVerde + byteAzul
				});
			}



		},
		//extra tools //////////////////////////////
		conectarNeurona: function(pos){
			var gui = this;
			var key = "x"+pos.x+"y"+pos.y;


			var cel = gui.layers[gui.sel.idLayer].cels[key];

			if(typeof(cel) == "undefined") return;

			var neurona = red.neuronas[key];


			if(Object.keys(neurona.dendritas).length > 0
			|| neurona.region == "ENTRADA"){
				return
			}

			Constructor.insertarAxonesConMascara({
				keyNeurona: key,
				mascara: guiConectoma.getLayers()
			});


			gui.onRefreshCell(key, cel.svgObject);
		},
		removeDendritas: function(pos){
			var gui = this;
			var key = "x"+pos.x+"y"+pos.y;


			var cel = gui.layers[gui.sel.idLayer].cels[key];

			if(typeof(cel) == "undefined") return;

			var neurona = red.neuronas[key];

			neurona.dendritas = [];

			gui.onRefreshCell(key, cel.svgObject);
		},
		getNeurona: function(pos){
			var gui = this;

			var key = "x"+pos.x+"y"+pos.y;


			var cel = gui.layers[gui.sel.idLayer].cels[key];


			if(typeof(cel) == "undefined") return;

			return red.neuronas[key];

		},
		watchConexiones: function(pos){
			var gui = this;


			if(typeof(gui.neuronaWatch = gui.getNeurona(pos)) == "undefined") return;

			$('#guiRed_Container>#toolbarInfo').text("Neurona: " + gui.neuronaWatch.id);

			console.log("Neurona en observación:");
			console.log(gui.neuronaWatch);


			gui.refresh()

		},
		watchConexionesEnd: function(pos){

			var gui = this;
			if(typeof(neuronaSel = gui.getNeurona(pos)) == "undefined") return;

			if(gui.neuronaWatch.id == neuronaSel.id){
				console.log("TODO: mostrar menu sobre neurona para editar sus conexiones ahi mismo");
			}else{
				gui.neuronaWatch = null
			}


		},

		neuronaWatch: null,
		verDendritas: function(neurona){
			var gui = this;

			for(keyDendrita in neurona.dendritas){
				var dendrita = neurona.dendritas[keyDendrita];



				for(keySinapsis in dendrita.sinapsis){

					var sinapsis = dendrita.sinapsis[keySinapsis];

					var pesoEfectivo;

					if(typeof(dendrita.peso) === "string"){
						pesoEfectivo = sinapsis.peso * window[dendrita.peso];
					}else{
						pesoEfectivo = sinapsis.peso * dendrita.peso;
					}

					var neurona_AxonEntrante = sinapsis.neurona_AxonEntrante;

					var _attr = {};
					if(pesoEfectivo>0){
						var color = Math.floor(pesoEfectivo * 200) + 55;

						_attr.fill = "rgb(55, "+color+", 55)";

					}else{
						var color = Math.floor(Math.abs(pesoEfectivo) * 200) + 55;

						_attr.fill = "rgb("+color+", 55, "+color+")";

					}

					if(neurona_AxonEntrante.valor == 1){
						_attr.stroke =  "#FFFFFF";
					}else{
						_attr.stroke =  "#000000";
					}


					var celSinapsis = gui.layers[gui.sel.idLayer].cels[keySinapsis];

					try {

						celSinapsis.svgObject.attr(_attr);
					} catch (e) {
						debugger
					}


				}
			}

			var cel = gui.layers[gui.sel.idLayer].cels[neurona.id];



			var bb = cel.svgObject.getBBox();

			gui.snap.line(
				bb.cx - (gui.escala.x / 2),
				bb.cy - (gui.escala.y / 2),
				bb.cx + (gui.escala.x / 2),
				bb.cy + (gui.escala.y / 2)
				).attr({

				stroke: "#FF00FF"
			});
			gui.snap.line(
				bb.cx + (gui.escala.x / 2),
				bb.cy - (gui.escala.y / 2),
				bb.cx - (gui.escala.x / 2),
				bb.cy + (gui.escala.y / 2)
				).attr({

				stroke: "#FF00FF"
			});

		},
		onRefresh: function(){
			var gui = this;


			if(gui.neuronaWatch){
				gui.verDendritas(gui.neuronaWatch);
			}

		}

	});

	$('#guiRed_Container>.toolbar>#addNeurona').on('click', function(e){
		guiRed.tool1 = "addCell";
		guiRed.tool2 = "removeCell";
	});

	$('#guiRed_Container>.toolbar>#conectar').on('click', function(e){
		guiRed.tool1 = "conectarNeurona";
		guiRed.tool2 = "removeDendritas";
	});


	$('#guiRed_Container>.toolbar>#watchConexiones').on('click', function(e){
		guiRed.tool1 = "watchConexiones";
		guiRed.tool2 = "watchConexionesEnd";

		guiRed.setAnchoPincel(1);
	});




	$('#guiRed_Container>.toolbar>.zoomIn').on('click', function(){

		guiRed.escala.x++;
		guiRed.escala.y++;

		guiRed.refresh()

	});


	$('#guiRed_Container>.toolbar>.zoomOut').on('click', function(){

		guiRed.escala.x--;
		guiRed.escala.y--;

		guiRed.refresh()

	});


	$('#guiRed_Container>.toolbar>.maximize').on('click', function(){
		var this_container = $(this).parent().parent();

		if(this_container.attr('maximized') == 'true'){
			$('#leftContainer').show();


			this_container.css({
				left: '50%',
				right: '0%'
			});

			this_container.attr('maximized', 'false');

		}else{

			$('#leftContainer').hide();

			this_container.show();


			this_container.css({
				left: '0%',
				right: '0%'
			});

			this_container.attr('maximized', 'true');
		}


	});

	////////////////////////////////////////// GUI RED //////////////////////////////////////

	$('#saveRed').on('click', function(){
		_red = Constructor.getRedData();
		var _redString = $.stringify(
			_red
		);

		try{
			sessionStorage.removeItem("_redString");
		}catch(e){

		}

		sessionStorage.setItem("_redString", _redString);



		console.log('copiar el contenido');
		console.log(_redString);
	});



	$('#loadRed').on('click', function(){
		var _redString = sessionStorage.getItem("_redString");
		if(_redString==null){
			presets.default();
		}else{
			red = Constructor.setRedData(
				JSON.parse(_redString)
			);
		}


		setControlCoeficientes();



		render = function(){
			for(iNeurona in red.neuronas){
				neurona = red.neuronas[iNeurona]
				guiRed.addCell(neurona.id, false);
			}
		};
		render();



		guiRed.setLayer(0, red.neuronas);
		guiRed.refresh()

	});








});
