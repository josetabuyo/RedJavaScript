$(function(){

			////////////////////////////////////////// GUI RED //////////////////////////////////////
			//GLOBAL
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

					if(typeof(red) == "undefined"){

						//GLOBAL
						red = new Red();
						Constructor.red = red;

					}

					Constructor.addNeurona({
						red: red,
						id: key
					});

					var cel = gui.layers[gui.sel.idLayer].cels[key];

					gui.onRefreshCell(key, cel.svgObject);


				},
				onRemoveCell: function(key){
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
						valor = neurona.axon.valor;
					}

					var byteColorHigth = ("0" + Math.floor(valor * 255).toString(16)).slice(-2); ;
					var byteColorLow = "00";

					var byteRojo = byteColorHigth;
					var byteVerde = byteColorHigth;
					var byteAzul = byteColorHigth;

					// DEFAULT
					svgObject.attr({
						fill: "#" + byteRojo + byteVerde + byteAzul,
						stroke: "#EEEEEE"
					});


					if(Object.keys(neurona.dendritas).length > 0){

						svgObject.attr({
							stroke: "#555555"
						});

					}


					if(neurona.tipo == "SALIDA"){

						var byteVerde = byteColorLow;
						var byteAzul = byteColorLow;

						svgObject.attr({
							fill: "#" + byteRojo + byteVerde + byteAzul,
							stroke: "#EE0000"
						});
					}

					if(neurona.tipo == "ENTRADA"){

						var byteRojo = byteColorLow;
						var byteVerde = byteColorLow;

						svgObject.attr({
							fill: "#" + byteRojo + byteVerde + byteAzul,
							stroke: "#0000EE"
						});
					}
				},
				//extra tools
				conectarNeurona: function(pos){
					var gui = this;
					var key = "x"+pos.x+"y"+pos.y;


					var cel = gui.layers[gui.sel.idLayer].cels[key];

					if(typeof(cel) == "undefined") return;

					var neurona = red.neuronas[key];

					if(Object.keys(neurona.dendritas).length > 0){
						return
					}

					Constructor.insertarAxonesConMascara({
						keyNeurona: key,
						mascara: guiDendritasModel.getLayers()
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


					$('#guiRed_Container>#toolbarInfo').text("Cantidad de entradas: " + Object.keys(red.entrada).length );

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

						neurona.tipo = "SALIDA";
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

							if(neurona_AxonEntrante.axon.valor == 1){
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




				if($('#control').css('display') == 'none' ){
					$('#guiRed_Container>#toolbarInfo').text("Coeficientes de la red");
					$('#control').show();

				}else{
					$('#guiRed_Container>#toolbarInfo').text("");
					$('#control').hide();

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

			$('#guiRed_Container>.toolbar>#makeEntrada').on('click', function(e){
				guiRed.tool1 = "makeEntradaNeurona";
				guiRed.tool2 = "removeCell";
			});

			$('#guiRed_Container>.toolbar>#makeSalida').on('click', function(e){
				guiRed.tool1 = "makeSalidaNeurona";
				guiRed.tool2 = "removeCell";
			});

			$('#guiRed_Container>.toolbar>#watchConexiones').on('click', function(e){
				guiRed.tool1 = "watchConexiones";
				guiRed.tool2 = "watchConexionesEnd";

				guiRed.setAnchoPincel(1);
			});


			////////////////////////////////////////// GUI RED //////////////////////////////////////


});
