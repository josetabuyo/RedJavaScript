
$(function(){

  $('#leftContainer').append(`
    <style>
  		#conectoma{
  			border: solid 1px;
  			border-color: Purple;
  			position: absolute;

  			left: 50%;
  			top: 0%;
  			height: 50%;
  			width: 50%;
        overflow: hidden;
  		}

      #conectoma #conectoma_celdas{
        height: 100%;
  			width: 100%;
        overflow: scroll;
      }

  		#conectoma #load select{
  			display: none;
  		}


      #conectoma .body{
				overflow: scroll;
			}

    </style>


    <div id="conectoma" class="guiMatrix container">
      <div id="conectoma_toolbar" class="toolbar">
        <div id="drawMode" class="boton" title="Modo de dibujo">
          D
        </div>
        <div id="addDendrita" class="boton" title="Agrega una dendrita">
          +
        </div>
        <div id="save" class="boton" title="Imprime por la console (F12) la estructura del modelo de conexionado">
          S
        </div>
        <div id="load" class="boton" title="Cargar un mapa de conexionado">
          L
          <select>
            <option value=""></option>
          </select>
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
      <div class="body">
        <div id="conectoma_celdas" class="cels">
          <svg id="conectoma_svg" width="10000px" height="10000px">
          </svg>
        </div>

        <ul id="conectoma_dendritas" class="layers">
        </ul>

      </div>


      <li id="template_conectoma_dendrita" class="layer template">
        <div class="idLayer">
        </div>
        <div class="data">
          <input class="conectoma_dendrita_data" value="1.0,1.0" type="text"/>
        </div>
      </li>

    </div>
  `);

  //GLOBAL
  guiConectoma = new GuiMatriz({
    idSvg: 'conectoma_svg',
    x: 20,
    y: 10,
    onRemoveLayers: function(){
      $('#conectoma_dendritas').html('');

    },
    onAddLayer: function(parent, idLayer){


      var domDentdrita = $('#template_conectoma_dendrita').clone()
                .attr('id', 'dendrita_nro_' + idLayer)
                .removeClass("template")
                ;


      domDentdrita.find(".idLayer").text(idLayer);


      domDentdrita.on('click', function(){
        parent.selLayer(idLayer);
      });



      var $conectoma_dendrita_data = domDentdrita.find(".conectoma_dendrita_data");

      if(this.layers[idLayer].data){

        $conectoma_dendrita_data.val(this.layers[idLayer].data.peso + "," + this.layers[idLayer].data.densidad );

      }

      $conectoma_dendrita_data.on('keypress', function(e){
        if (e.keyCode == 13) {

          var params = $(this).val().split(",");

          guiConectoma.layers[idLayer].data = {
            peso: params[0],
            densidad: params[1]
          };
          }
      });


      $('#conectoma_dendritas').append(domDentdrita);


    }
  });

  $('#conectoma>.toolbar>#drawMode').on('click', function(){
    guiConectoma.setDrawModeNext();
  });


  $('#conectoma>.toolbar>#addDendrita').on('click', function(){
    guiConectoma.addLayer();
  });



  var $template_conexionado_select = $('#conectoma>.toolbar>#load>select');

  keysConexionado = Object.keys(conexionados);
  for(iTemplateConexionado in keysConexionado){
    $template_conexionado_select.append("<option value='" + keysConexionado[iTemplateConexionado] + "'>" + keysConexionado[iTemplateConexionado] + "</option>");
  }

  $template_conexionado_select.on('change', function(){
    event.stopPropagation()



    if($(this).val() == ""){
      return;
    }
    //   guiConectoma.removeLayers();
    //   guiConectoma.addLayer();
    // }else{
    
    guiConectoma.loadLayers(conexionados[$(this).val()]);

    // }

    $(this).hide();
  });



  $('#conectoma>.toolbar>#load').on('click', function(){
    event.stopPropagation()
    $(this).find('select').show();
  });


  $('#conectoma>.toolbar>#save').on('click', function(){
    var model = guiConectoma.getLayers();

    var modelString = JSON.stringify(model);


    console.log('Modelo de conexionado');
    console.log('copiar el contenido');
    console.log(modelString);

  });



  $('#conectoma>.toolbar>.zoomIn').on('click', function(){

    guiConectoma.escala.x++;
    guiConectoma.escala.y++;

    guiConectoma.refresh()

  });


  $('#conectoma>.toolbar>.zoomOut').on('click', function(){

    guiConectoma.escala.x--;
    guiConectoma.escala.y--;

    guiConectoma.refresh()

  });


  // $('#conectoma>.toolbar>.maximize').on('click', function(){
  //
  //   var this_container = $(this).parent().parent();
  //
  //
  //   if(this_container.hasClass('maximized')){
  //     $('#leftContainer .container').show();
  //     this_container.removeClass('maximized')
  //   }else{
  //     $('#leftContainer .container').hide();
  //     this_container.show();
  //     this_container.addClass('maximized');
  //   }
  //
  //
  // });




});

