$(function(){


  $('#controlRed_Container').append(`

    <style>
      #regiones{
        position: absolute;
        left: 0px;
        top: 0px;
        width: 50%;
        height: 50%;
      }

      li#addRegion>input[type=text] {
        width: 100%;
        box-sizing: border-box;
        border: solid 1px;
        border-color: Purple;
        background-color: Black;
        color: White;
      }


      li.region{
        vertical-align: middle;
        color: white;
      }

      div.region_ref{
        display: inline-block;
        font-size: 1em;
      }


      li.region_selected{
        font-weight: bold;
      }

      #addRegion{
        vertical-align: middle;
        color: white;
      }
    </style>



    <div id="regiones">
      <div class="toolbar">
        <div id="conectar" class="boton" title="Conectar neuronas">
          C
        </div>
        <div id="conectar_Accept" class="boton">
          Accept
        </div>
        <div id="makeEntrada" class="boton" title="Agregar neuronas a coleccion de Entradas">
          I
        </div>
        <div id="makeSalida" class="boton" title="Agregar neuronas a coleccion de Salidas">
          O
        </div>
      </div>
      <ul>
        <li id="addRegion"><input type="text"/></li>
      </ul>
    </div>
  `);


  var addRegion = function(region){


    var domRegion = $('#plantilla_region').clone()
              .attr('id', 'region_' + region)
              ;
    domRegion.find(".region_ref").text(region);


    if(region == "SALIDA"){
      domRegion.css('color', 'red');
    }else if(region == "ENTRADA"){
      domRegion.css('color', 'blue');
    }else if(region == "INTERNA"){
      domRegion.css('color', 'white');
    }else{
      domRegion.css('color', "rgb(" + Math.round((Math.random()*255)) + "," + Math.round((Math.random()*255)) + "," + Math.round((Math.random()*255)));
    }



    domRegion.on('click', function(){
      guiRed.region = $(this).find(".region_ref").text();
      $('.region').removeClass('region_selected');
      $(this).addClass('region_selected');

    });

    domRegion.insertBefore('#addRegion');
  }



  for(region in red.regiones){
    addRegion(region);
  };


  $('#addRegion>input').on('keypress', function(e){

    if(e.key == "Enter"){
      var region = $(this).val();
      red.regiones[region]={};
      addRegion(region);
      $(this).val('')
    }

  });
  var regionSource;

  var regionSelect = function(event){

    if(Constructor.keyRegionArrayConector == "undefined") return;

    var region = event.target.innerHTML;


    Constructor.keyRegionArrayConector.push(region);

  };

  $('#regiones>.toolbar #conectar_Accept').hide();

  $('#regiones>.toolbar>#conectar').on('click', function(e){
    event.preventDefault();
    Constructor.keyRegionArrayConector = [];

    $('#regiones').on( "click", "li.region", regionSelect);

    $('#regiones>.toolbar #conectar_Accept').show();

  });

  $('#regiones>.toolbar #conectar_Accept').on('click', function(e){

    e.preventDefault();
    Constructor.conectarRegiones(Constructor.keyRegionArrayConector);

    var keyRegionSource = Constructor.keyRegionArrayConector.shift();

    for (iKeyRegion in Constructor.keyRegionArrayConector){

      var keyRegionTarget = Constructor.keyRegionArrayConector[iKeyRegion];

      var regionSource = $('#region_' + keyRegionSource);

      var regionTarget = $('#region_' + keyRegionTarget)

      var conector = $("<b>&#169;</b>")

      conector.css('color', regionSource.css('color'))

      regionTarget.append(conector);
    }


    delete Constructor.keyRegionArrayConector;
    $('#regiones').off( "click", "li.region");
    $('#regiones>.toolbar #conectar_Accept').hide();

  });


});
