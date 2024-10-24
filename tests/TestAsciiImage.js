class TestAsciiImage extends Test{

  start (opt){
    var test =  this;



    $.extend(test, {
      entrada: null,
      salida: null,
      escala: 25,

      altoPixel: 11,
      pixelBig:{}

    }, opt);

    test.onStep_vEventos = [];


    if(Object.keys(test.red.neuronas).length == 0){
      alert("Debe existir al menos una neurona");
      return
    }

    $('#tests #TestAsciiImage_Container').show()

    test.canvas = document.querySelector("#TestAsciiImage_Container canvas");


    test.canvas.width = test.altoPixel;
    test.canvas.height = test.altoPixel;

    test.ctx = test.canvas.getContext("2d");



    $("#TestAsciiImage_Container svg").attr("width",  test.escala * test.altoPixel);
    $("#TestAsciiImage_Container svg").attr("height", test.escala * test.altoPixel);

    test.snap = Snap("#TestAsciiImage_Container svg");

    for(var y = 0; y < test.altoPixel; y++){
      for(var x = 0; x < test.altoPixel; x++){


        var key = Constructor.keyByCoord(x, y);

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
  }

  step() {
    //drawVisual = requestAnimationFrame(test.step);
    var test = this;

    var $test = $("#TestAsciiImage_Container")
    var texto = $test.find("input").val();

    // Choosing a random character
    // var random = Math.random() * texto.length;
    // var index = Math.floor(random);

    if(typeof(test.index) == "undefined"){
      // test.index = -test.altoPixel
      test.index = -1 // the first thing will be to add 1
    }

    // Choosing the next character
    var new_index;
    var index = test.index + 1;

    if(index >= texto.length){
      new_index = index - texto.length;
    }else if(index < 0){
      new_index = index + texto.length;
    }else {
      new_index = index;
    }
    
    
    var caracter = texto.substring(new_index, new_index+1);
    test.index = new_index;

    if(caracter==""){
      debugger
    }

    // if(test.index < (test.altoPixel*texto.length)){
    //   test.index++;
    // }else{
    //   test.index= -test.altoPixel;
    // }

    test.ctx.clearRect(0, 0, test.canvas.width, test.canvas.height);
    test.ctx.font = (test.altoPixel+1) + "px Arial";
    test.ctx.fillStyle = "blue";
    test.ctx.fillText(caracter, 1, test.altoPixel-1);
    // test.ctx.fillText(texto, -test.index, test.altoPixel-1);

    test.printEntrada();

    super.step();
  }

  printEntrada(){
    var test = this;

    var index = 0;



    for(var x=0; x<test.altoPixel; x++){
      for(var y=0; y<test.altoPixel; y++){

        var data = test.ctx.getImageData(x, y, 1, 1).data;
        var valorActivacion = data[2]

        if(valorActivacion==0){
          valorActivacion = Math.floor(Math.random() * 255);
        }

        var key = Constructor.keyByCoord(x, y);

        test.pixelBig[key].attr({
          fill:"rgb("+valorActivacion+","+valorActivacion+","+valorActivacion+")"
        });

        key = Object.keys(red.regiones["ENTRADA"])[index]
        
        index++;
        
        
        var neurona = red.neuronas[key];
        if(typeof(neurona) == "undefined"){
          continue
        }
        
        neurona.activarExternal(valorActivacion / 255);

      }
    }
  }
}





/************** :TEST: ************/
$(function(){
  $('#tests>.body').append(`
		<style>
			#TestAsciiImage_Container{
        position: absolute;
				border-color: Yellow;
        left: 0%;
        right: 0%;
        top: 0%;
        bottom: 0%;

			}

			#TestAsciiImage_Container canvas{
				position: absolute;
        left: 10px;
				top: 0px;

				border: solid 1px;
				border-color: Yellow;
			}

      #TestAsciiImage_Container input{
        position: absolute;
        top: 0px;
        left: 40px;
        right: 10px;
      }

			#TestAsciiImage_Container svg{
				position: absolute;
        left: 100px;
        top: 24px;
				right: 24px;
        bottom: 0px;
				border: solid 1px;
				border-color: Yellow;
			}
		</style>

		<div id="TestAsciiImage_Container">
			<input value="XXXXXXXXXXXXXXOOOOOOOOOOOOOOOO"></input>
			<canvas></canvas>
			<svg></svg>
		</div>
	`);

  $('#tests>.toolbar select').append("<option value='TestAsciiImage'>TestAsciiImage</option>");


  $("#tests #TestAsciiImage_Container").hide()

});
