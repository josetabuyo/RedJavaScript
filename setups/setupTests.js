$(function(){


  $('#leftContainer').append(`

    <style>
      #tests{
        position: absolute;
        left: 0;
        top: 20%;
        width: 50%;
        height: 50%;
      }


      #tests #play{
        width: 60px;
      }
      #tests #play.play{
        background-color: #66AA66;
      }
      #tests #play.pause{
        background-color: #AA6666;
      }

    </style>



    <div id="tests" class="container">
      <div class="toolbar">
        <div id="play" class="boton play" title="Play o Pause al test continuo">
          Play
        </div>
        <div id="step" class="boton" title="Ejecuta solo un test">
          Step
        </div>

        <select title="Selecciona un test" placeholder="Selecciona un test">
          <option value=""></option>
        </select>

        <div class="maximize boton botonLeft" title="Maximizar">
				#
				</div>
      </div>
      <div class="body">
      </div>

    </div>

  `);


  $('#tests>.toolbar select').on('change', function(e){


    $('#tests .body>div').hide();


    try{
      delete test
    }catch(e){

    }

    var testString = $(this).val();

    if(testString == ""){
      return;
    }

    eval(`test = new ${testString}();`)


    test.start({
      red: red
    });

    test.onStep(function(){
      guiRed.refresh();
    });


  });

  $('#tests>.toolbar #step').on('click', function(){
    test.step();
  });

  $('#tests>.toolbar #play').on('click', function(){

    if(typeof(test) == "undefined"){
      alert("Falta elegir un test");
      return;
    };


    var btn_play = $('#play');
    btn_play.removeClass('pause');
    btn_play.removeClass('play');


    if(!test.running){
      test.play();
      btn_play.addClass('pause');
      btn_play.text('Pause');
    }else{
      test.stop();
      btn_play.addClass('play');
      btn_play.text('Play');
    }
  });




});
