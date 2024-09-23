class TestAutomata extends Test {

	start(opt) {

		var test = this;

		$.extend(test, {
			NOISE_LEVEL: 0.01,
			running: false,
			estado: {
				current: {
					neuronaCoord: { x: null, y: null }
				}
			},
			patron: {
				mapaCelda: [],
				entrada: [0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0],
				salida: [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0]
			},
			testInterval: null,
			foco: null,
			offset: 0,



			entrada: null,
			salida: null,
			noise: true,



			context: {
				automata: null,
				externo: null,
				debugMode: false,
				motor: [0.0, 0.0, 0.0, 0.0]
			}
		}, opt);



		if (Object.keys(test.red.neuronas).length == 0) {
			alert("Debe existir al menos una neurona");
			return
		}





		$("#TestAutomata_Container").show()

		var svgSelector = "#TestAutomata_Container svg"
		test.snap = Snap(svgSelector);
		test.svg = $(svgSelector)








		var fondo = test.snap.group(
			test.snap.rect(0, 0, test.svg.width(), test.svg.height())
		);
		fondo.attr({
			fill: "#000000"
		});
		fondo.click(function () {
			test.context.debugMode = !test.context.debugMode;
		});


		var automata = test.snap.group(
			test.snap.circle(0, 0, 30)
		);
		automata.attr({
			fill: "rgb(0,0,255)"
		});
		automata.transform('T200,150');

		test.context.automata = automata;

		test.addExterno({ color: "rgb(255,0,0)" });
		test.addExterno({ color: "rgb(255,0,0)" });
		test.addExterno({ color: "rgb(255,0,0)" });

		test.addExterno({ color: "rgb(0,255,0)" });
		test.addExterno({ color: "rgb(0,255,0)" });
		test.addExterno({ color: "rgb(0,255,0)" });


		$('body').on('keydown', function (e) {
			var motor = test.context.motor;

			switch (e.which) {
				case 37:
					motor[0] = 1.0;
					break;
				case 38:
					motor[2] = 1.0;
					break;
				case 39:
					motor[1] = 1.0;
					break;
				case 40:
					motor[3] = 1.0;
					break;
			};


		});
		$('body').on('keyup', function (e) {
			var motor = test.context.motor;

			switch (e.which) {
				case 37:
					motor[0] = 0.0;
					break;
				case 38:
					motor[2] = 0.0;
					break;
				case 39:
					motor[1] = 0.0;
					break;
				case 40:
					motor[3] = 0.0;
					break;
			};
		});
	}














	desplazamientoConstante() {
		var test = this;

		var testIndex = test.estado.current.neuronaCoord.x;

		if (testIndex == null) {
			testIndex = Math.round(test.red.size.x / 2);
			test.estado.current.neuronaCoord = { x: testIndex, y: test.red.size.y - 1 };
		}


		for (var i = test.boxEntrada.x0; i <= test.boxEntrada.x1; i++) {
			for (var j = test.boxEntrada.y0; j <= test.boxEntrada.y1; j++) {
				var valor;

				if (test.noise) {
					valor = Math.random() * test.NOISE_LEVEL;
				} else {
					valor = 0;
				}

				var keyNeurona = Constructor.keyByCoord(i, j);

				test.red.neuronas[keyNeurona].activarExternal(valor);



			}
		}


		for (var iEntrada = 0; iEntrada < test.patron.entrada.length; iEntrada++) {
			var x = testIndex - iEntrada;
			var y = test.red.size.y - 1;

			if (x < 0) {
				x = test.red.size.x + x;
			}

			var index = test.patron.entrada.length - 1 - iEntrada;

			var keyNeuronaEntrada = Constructor.keyByCoord(x, y);
			test.red.neuronas[keyNeuronaEntrada].activarExternal(test.patron.entrada[index]);

			var keyNeuronaSalida = Constructor.keyByCoord(x, 0);
			test.red.neuronas[keyNeuronaSalida].activarExternal(test.patron.salida[index]);

		}



		test.estado.current.neuronaCoord.x++;
		if (test.estado.current.neuronaCoord.x >= test.red.size.x) {
			test.estado.current.neuronaCoord.x = 0;
		}

	}


	printEntrada() {
		var test = this;






		for (var i = test.boxEntrada.x0; i <= test.boxEntrada.x1; i++) {
			for (var j = test.boxEntrada.y0; j <= test.boxEntrada.y1; j++) {
				var valor = 0;

				if (test.noise) {
					valor = Math.random() * test.NOISE_LEVEL;
				} else {
					valor = 0;
				}

				var keyNeurona = Constructor.keyByCoord(i, j);

				test.red.neuronas[keyNeurona].activarExternal(valor);

			}
		}




		if (!test.foco) {
			test.foco = test.red.size.x / 2;
		}

		for (var iEntrada = 0; iEntrada < test.patron.entrada.length; iEntrada++) {

			var x = test.foco - iEntrada + Math.round(test.patron.entrada.length / 2) + test.offset;
			var y = test.red.size.y - 1;

			if (x < 0) {
				x = x + test.red.size.x;
			}

			if (x > test.red.size.x - 1) {
				x = x - test.red.size.x;
			}


			var index = test.patron.entrada.length - 1 - iEntrada;
			try {
				var keyNeurona = Constructor.keyByCoord(x, y);
				var valor = test.patron.entrada[index];


				test.red.neuronas[keyNeurona].activarExternal(valor);


			} catch (e) {
				debugger;
			}

		}
	}

	obtenerSalida(modo) {

		//tomo el centro de masa (x,y) de la salida
		var sumaTension = 0.0;

		var sumaProducto = {
			x: 0.0,
			y: 0.0
		};

		for (var i = test.boxSalida.x0; i <= test.boxSalida.x1; i++) {
			for (var j = test.boxSalida.y0; j <= test.boxSalida.y1; j++) {

				var keyNeurona = "x" + i + "y" + j;
				var neurona = test.red.neuronas[keyNeurona];

				sumaTension += neurona.tensionSuperficial;
				sumaProducto.x += neurona.tensionSuperficial * (i + 1);
				sumaProducto.y += neurona.tensionSuperficial * (j + 1);

				if (neurona.tensionSuperficial > 1) {
					// DEBUG: no debería pasar esto
					debugger;
				}


				if (sumaTension > test.boxSalida.x1) {
					// DEBUG: no debería pasar esto
					debugger;
				}

				if (sumaTension > sumaProducto.x) {
					// DEBUG: no debería pasar esto
					debugger;
				}


			}
		}


		if (sumaTension > 0) {
			var mediaX = sumaProducto.x / sumaTension * 1.0;
		}

		return Math.round(mediaX);


	}

	debugEstandar() {
		var test = this;

		test.printEntrada();
		test.onStep();
	}

	printEntrada() {

		if (Object.keys(red.regiones["ENTRADA"]).length = 0) {
			return;
		}


		//Ponemos base de ruido
		for (key in red.regiones["ENTRADA"]) {

			var neurona = red.neuronas[key];

			if (test.noise) {
				neurona.activarExternal(Math.random() * test.NOISE_LEVEL);
			} else {
				neurona.activarExternal(0);
			}
		}


		var printExterno = function (externo) {

			var bb = externo.getBBox();
			var rad = (bb.width / 2)


			var posExterno = {
				x: (bb.x + rad),
				y: (bb.y + rad)
			};

			var automata = test.context.automata;
			var bb = automata.getBBox();

			var posAutomata = {
				x: (bb.x + rad),
				y: (bb.y + rad)
			};

			var vec = {
				x: (posAutomata.x - posExterno.x),
				y: -(posAutomata.y - posExterno.y)
			};


			var distancia = Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2));

			if (distancia > rad * 16) return; /// Estaría muy lejos, no lo vería


			var anguloOffset = Math.atan2(rad, distancia);


			var anguloCentro = Math.atan2(vec.x, vec.y);

			var anguloMax = anguloCentro + anguloOffset;
			var anguloMin = anguloCentro - anguloOffset;




			var keysbyindex = Object.keys(red.regiones["ENTRADA"]);


			var pixelMax = Math.round((keysbyindex.length / (2 * Math.PI)) * anguloMax);
			var pixelMin = Math.round((keysbyindex.length / (2 * Math.PI)) * anguloMin);

			var vColor = test.getColor(externo);


			for (var i = pixelMin; i <= pixelMax; i++) {
				var index = i;

				if ((index < 0)) {
					index += keysbyindex.length;
				} else if ((index > keysbyindex.length)) {
					index -= keysbyindex.length;
				}




				try {
					var keyNeurona = keysbyindex[index];


					var valor;
					if ((index % 3) == 0) valor = Math.round(vColor[0] / 255);
					else if ((index % 3) == 1) valor = Math.round(vColor[1] / 255);
					else if ((index % 3) == 2) valor = Math.round(vColor[2] / 255);

					test.red.neuronas[keyNeurona].activarExternal(valor);
				} catch (e) {
					console.log(e);
				}
			}






		};

		test.snap.selectAll('.externo').forEach(function (externo) {
			printExterno(externo);
		});

	}

	debugPrintEntrada() {
		// TODO: para debuggear mockeo los ojos usando el motor
		var motor = test.context.motor;


		var keyNeurona;
		var valor;
		var indexInput = -1; //Para que arranque en 0 la primera

		//LEFT
		valor = motor[0];
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);



		//RIGHT
		valor = motor[1];
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);

		//UP
		valor = motor[2];
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);


		//DOWN
		valor = motor[3];
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);
		keyNeurona = Constructor.keyByCoord(test.red.box.x0 + (++indexInput), test.red.box.y1);
		test.red.neuronas[keyNeurona].activarExternal(valor);

	}

	addExterno(opt) {
		test = this
		if (!opt) opt = {};

		opt = $.extend(true, {}, {
			pos: {
				x: Math.round((Math.random() * test.svg.width())),
				y: Math.round((Math.random() * test.svg.height())),
			},
			color: "#AABBAA"
		}, opt);



		var externo = test.snap.group(
			test.snap.circle(0, 0, 30)
		);

		externo.attr({
			fill: opt.color,
			class: "externo"
		});


		externo.transform("T" + opt.pos.x + "," + opt.pos.y);


		return externo;

	}

	getColor(externo) {

		var colorString = externo.attr('fill');

		colorString = colorString.replace('rgb(', '').replace(')', '');

		return colorString.split(', ');
	}


	step() {
		var test = this;

		var paso = 5;

		var automata = test.context.automata;



		/// PASO 1:
		/// ACTUALIZA EXTERNOS



		var moverExterno = function (externo) {
			//TODO: quitar cuando no se requiera mas
			if (test.context.debugMode) return;

			//mover los elementos del mundito: externo, enemigos, etc

			var vel = {
				x: 0,
				y: 0.5
			};

			var bb = externo.getBBox();

			var pos = {
				x: (bb.x + (bb.width / 2)) + (vel.x * paso),
				y: (bb.y + (bb.height / 2)) + (vel.y * paso)
			};


			if (!(pos.y > test.svg.height())) {
				externo.transform('T' + pos.x + ',' + pos.y);
			} else {

				var vColor = test.getColor(externo);
				externo.remove();

				test.addExterno({
					pos: {
						y: 0
					},
					color: "rgb(" + vColor[0] + "," + vColor[1] + "," + vColor[2] + ")"
				});
			}
		};



		test.snap.selectAll('.externo').forEach(function (externo) {
			moverExterno(externo);
		});




		/// PASO 2:
		/// PROYECTA EN RETINA
		test.printEntrada();


		/// PASO 3:
		/// DETECTAR COLICIONES






		var distancia = function (externo) {

			var bb = externo.getBBox();
			var radExterno = (bb.width / 2)

			var posExterno = {
				x: (bb.x + radExterno),
				y: (bb.y + radExterno)
			};

			var bb = automata.getBBox();
			var radAutomata = (bb.width / 2)

			var posAutomata = {
				x: (bb.x + radAutomata),
				y: (bb.y + radAutomata)
			};

			var vec = {
				x: (posAutomata.x - posExterno.x),
				y: -(posAutomata.y - posExterno.y)
			};


			var distancia = Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2));


			return (distancia - radExterno - radAutomata) / (2 * radAutomata);



		}







		var solapamiento = {
			penetracion: 0,
			color: null
		};

		test.snap.selectAll('.externo').forEach(function (externo) {

			var distanciaExterno = distancia(externo);
			if (distanciaExterno < 0) {

				var penetracion = -distanciaExterno;


				var vColor = test.getColor(externo);


				if (penetracion > solapamiento.penetracion) {
					solapamiento = {
						penetracion: penetracion,
						color: vColor
					};
				}

			}
		});


		var COEF_DOLOR = 0.01;


		var setCoef = function (proto, nameSly, valor, escala) {
			var objSly = $('#' + nameSly);

			if (!escala) escala = 1;

			objSly.val(valor * escala * 255);
			proto[nameSly] = valor;

			objSly.siblings().text(nameSly + ": " + proto[nameSly]);

		};


		// ESTIMULOS HORMONALES AL SISTEMA POR PENETRACION
		if (solapamiento.penetracion > 0) {

			var valor;

			if (solapamiento.color[0] == 255) {
				//MALO
				valor = (1 - solapamiento.penetracion);
			} else {
				//BUENO
				valor = solapamiento.penetracion;
			}


			valor = valor * COEF_DOLOR;

			//setCoef(Sinapsis.prototype, "DEPRECATED COEF _SINAPSIS_ ENTRENAMIENTO", valor, 100);


		} else {

			//var valor = Sinapsis.prototype.DEPRECATED COEF _SINAPSIS_ ENTRENAMIENTO;
			//setCoef(Sinapsis.prototype, "DEPRECATED COEF _SINAPSIS_ ENTRENAMIENTO", valor, 100);
		}





		/// PASO 4:
		/// PROCESA LA RED, lo hace el suoer
		super.step();







		/// PASO 5:
		/// LEE SALIDAS MUEVE MOTORES

		var motor = [0.0, 0.0, 0.0, 0.0];;


		var COEF_LOCAL_POW_MOTOR = 2;

		var sumaTensionTotalSalida = 0.0;





		//TODO: quitar cuando no se requiera mas
		if (!test.context.debugMode) {

			if (Object.keys(red.salida).length == 0) {
				return;
			}


			var keys = Object.keys(red.salida);

			for (key in keys) {

				var neurona = red.salida[keys[key]];



				var indiceMotor = Math.floor((key / keys.length) * motor.length);


				if (!isNaN(neurona.tensionSuperficial)) {

					motor[indiceMotor] += neurona.tensionSuperficial;

					sumaTensionTotalSalida += neurona.tensionSuperficial;
				}
			}
		}



		for (iMotor in motor) {
			//lo normalizo
			if (sumaTensionTotalSalida) {
				motor[iMotor] = motor[iMotor] / sumaTensionTotalSalida * COEF_LOCAL_POW_MOTOR;
			} else {
				motor[iMotor] = 0.0;
			}

			//Le sumo lo que se haya hecho con el motor por fuera (teclas)
			motor[iMotor] += test.context.motor[iMotor];
		}


		/// PASO 6:
		/// ACTUALIZA POSICION DEL AUTOMATA



		var vel = {
			x: motor[1] - motor[0],
			y: motor[3] - motor[2]
		};

		var bb = automata.getBBox();

		var pos = {
			x: (bb.x + (bb.width / 2)) + (vel.x * paso),
			y: (bb.y + (bb.height / 2)) + (vel.y * paso)
		};

		if (pos.x < 0) pos.x = test.svg.width();
		if (pos.y < 0) pos.y = test.svg.height();
		if (pos.x > test.svg.width()) pos.x = 0;
		if (pos.y > test.svg.height()) pos.y = 0;

		automata.transform('T' + pos.x + ',' + pos.y);

	}
}




$(function () {
	$('#tests>.body').append(`
		<style>
			#TestAutomata_Container{
				border-color: Yellow;
			}
			#TestAutomata_Container svg{
				position: absolute;

        width: 100%;
        height: 100%;

        border: solid 1px green;
				overflow: scroll;
			}
		</style>

		<div id="TestAutomata_Container">
			<svg></svg>
		</div>
	`);

	$('#tests>.toolbar select').append("<option value='TestAutomata'>TestAutomata</option>");



	$("#tests #TestAutomata_Container").hide()



});
