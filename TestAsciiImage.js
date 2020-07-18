/************** :TEST: ************/
var TestAsciiImage = function(opt){
	$.extend(this, {
		entrada: null,
		salida: null,
		escala: 25,

		altoPixel: 8,
		pixelBig:{}

	}, opt);

	this.start();
};

TestAsciiImage.prototype = {
	onStep_vEventos: [],
	onStep: function(param){
		if(typeof param == "function"){
			this.onStep_vEventos.push(param);
		}else{
			$.each(this.onStep_vEventos, function(index, value){
				value(param);
			});
		}
	},
	play: function(){
		var test = this;


		if(!test.running){

			//drawVisual = requestAnimationFrame(test.step);

			test.testInterval = setInterval(function (){
				test.step();
			}, 0);


			test.running = true;
		}

	},

	start: function (){
		var test =  this;

		$("#TestAsciiImage_Container").show()

		test.canvas = document.querySelector("#TestAsciiImage_Container canvas");


		test.canvas.width = test.altoPixel;
		test.canvas.height = test.altoPixel;

		test.ctx = test.canvas.getContext("2d");



	  $("#TestAsciiImage_Container svg").attr("width",  test.escala * test.altoPixel);
    $("#TestAsciiImage_Container svg").attr("height", test.escala * test.altoPixel);

		test.snap = Snap("#TestAsciiImage_Container svg");

		for(var y = 0; y < test.altoPixel; y++){
			for(var x = 0; x < test.altoPixel; x++){


				key = Constructor.keyByCoord(x, y);

				test.pixelBig[key] = test.snap.rect(
					x * test.escala,
					y * test.escala,
					test.escala,
					test.escala
				).attr({
					"id" 						: "pixelBig"+key,
					"stroke" 				: "#111111",
					"fill" 					: "#000000"
				});


			}

		}



	},
	step:function(){
		//drawVisual = requestAnimationFrame(test.step);
		var test = this;

		var $test = $("#TestAsciiImage_Container")

		if(typeof(test.index) == "undefined"){
			test.index = 0
		}

		texto = $test.find("input").val()
		caracter = texto.substring(test.index, test.index+1);

		if(test.index < texto.length-1){
			test.index++;
		}else{
			test.index=0;
		}

		test.ctx.clearRect(0, 0, test.canvas.width, test.canvas.height);
		test.ctx.font = (test.altoPixel+1) + "px Arial";
		test.ctx.fillStyle = "blue";
		test.ctx.fillText(caracter, 0, test.altoPixel-2);


		test.printEntrada();
		red.procesar();

		test.onStep();
	},

	stop: function(){
		clearInterval(this.testInterval);
		test.running = false;
	},


	printEntrada: function(){
		test = this;

		var index = 0;




		for(x=0; x<test.altoPixel; x++){
			for(y=0; y<test.altoPixel; y++){

				var data = test.ctx.getImageData(x, y, 1, 1).data;
				valorActivacion = data[2]


				key = Constructor.keyByCoord(x, y);

				test.pixelBig[key].attr({
					fill:"rgb("+valorActivacion+","+valorActivacion+","+valorActivacion+")"
				});

				key = Object.keys(red.entrada)[index]
				var neurona = red.neuronas[key];

				index++;
				neurona.activarExternal(valorActivacion / 255);


			}
		}


	}


};
