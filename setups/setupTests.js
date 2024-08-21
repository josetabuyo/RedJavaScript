$(function(){


  $('#leftContainer').append(`

    <style>
      #tests{
        position: absolute;
        left: 0;
        top: 23%;
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

  });
  
  test = new TestDummy();

  test.start({
    red: red
  });
  
});
