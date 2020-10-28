$(function(){

	$('body').append(`
		<style>
			#guiRed_Container{
				position: absolute;
				left: 0px;
				top: 40px;
				right: 50%;
				bottom: 0px;
				overflow: hidden;
				border: solid 3px;
				border-color: violet;
			}
			#guiRed_Container #load select{
				display: none;
			}


		</style>

		<div id="guiRed_Container"  class="guiMatrix">
			<div class="cels">
				<svg id="guiRed_svg" width="10000px" height="10000px" >
				</svg>
			</div>
			<div class="toolbar">
				<div id="showControl" class="boton" title="Muestra el control de los coeficientes">
					...
				</div>

				<div id="addNeurona" class="boton" title="Agregar neuronas">
					N
				</div>
				<div id="conectar" class="boton" title="Conectar neuronas">
					C
				</div>
				<div id="makeEntrada" class="boton" title="Agregar neuronas a coleccion de Entradas">
					I
				</div>
				<div id="makeSalida" class="boton" title="Agregar neuronas a coleccion de Salidas">
					O
				</div>
				<div id="watchConexiones" class="boton" title="Ver las conexiones de la neurona seleccionada">
					W
				</div>
			</div>
			<div id="toolbarInfo">
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

			if(modo=="DEPOLARIZACION"){
				valor = neurona.tensionSuperficial / Axon.prototype.COEF_AXON_UMBRAL_SPIKE * 0.8;

			} else if(modo=="ACTIVACION"){
				valor = neurona.valor;
			}

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
		makeEntradaNeurona: function(pos){
			var gui = this;

			var key = "x"+pos.x+"y"+pos.y;



			var cel = gui.layers[gui.sel.idLayer].cels[key];


			if(typeof(cel) == "undefined") return;





			var neurona = red.neuronas[key];

			if(typeof(neurona) != "undefined"){


				Constructor.makeEntradaNeurona(neurona);
			}


			$('#guiRed_Container>#toolbarInfo').text("Cantidad de entradas: " + Object.keys(red.regiones["ENTRADA"]).length );

			gui.onRefreshCell(key, cel.svgObject);
		},
		makeSalidaNeurona: function(pos){
			var gui = this;

			var key = "x"+pos.x+"y"+pos.y;



			var cel = gui.layers[gui.sel.idLayer].cels[key];


			if(typeof(cel) == "undefined") return;



			if(cel.data.salida) return;
			if(cel.data.entrada) return;


			cel.data.salida = true;


			var neurona = red.neuronas[key];

			if(typeof(neurona) != "undefined"){

				red.salida[key] = neurona;

				neurona.region = "SALIDA";
				neurona.axon.sinapsis = {};
			}

			$('#guiRed_Container>#toolbarInfo').text("Cantidad de salidas: " + Object.keys(red.salida).length );

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
					var pesoEfectivo = sinapsis.peso * dendrita.peso;

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

					celSinapsis.svgObject.attr(_attr);

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


	$('#guiRed_Container>.toolbar>#showControl').on('click', function(e){
		$('.rightContainer').hide();
		$('#controlRed_Container').show();
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


	////////////////////////////////////////// GUI RED //////////////////////////////////////


});
