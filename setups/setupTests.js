$(function(){


  $('#rightContainer').append(`

    <style>
      #tests{
        position: absolute;
        left: 50%;
        top: 50%;
        width: 50%;
        height: 50%;
      }
    </style>



    <div id="tests" class="container">
      <div class="toolbar">

        <div id="select" class="boton" title="Selecciona un test">
          S
        </div>
        <div id="select_Accept" class="boton">
          <select>
            <option value=""></option>
          </select>
        </div>

        <div class="maximize boton botonLeft" title="Maximizar">
				#
				</div>
      </div>

    </div>

  `);

  $('#tests>.toolbar #select_Accept').hide();

  $('#tests>.toolbar #select').on('click', function(e){
    event.preventDefault();
    $('#tests>.toolbar #select_Accept').show();
  });



  $('#tests>.toolbar #select_Accept').on('click', function(e){



    try{
      delete test
    }catch(e){

    }

    var testString = $(this).find('select').val();


    eval(`test = new ${testString}();`)


    test.start({
      red: red
    });

    test.onStep(function(){
      guiRed.refresh();
    });

    $('#tests>.toolbar #select_Accept').hide();

  });




});
