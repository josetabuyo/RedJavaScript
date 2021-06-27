
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

  $template_conexionado_select.on('click', function(){
    event.stopPropagation()

    if($(this).val() == ""){
      guiConectoma.removeLayers();
      guiConectoma.addLayer();
    }else{
      guiConectoma.loadLayers(conexionados[$(this).val()]);
    }

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
conexionados = {
    conexion_corona_kohonen: [
        {
            "cels": {
                "x-1y-1": {},
                "x-1y0": {},
                "x-1y1": {},
                "x0y-1": {},
                "x0y1": {},
                "x1y-1": {},
                "x1y0": {},
                "x1y1": {}
            },
            "data": {
                "densidad": "1.0",
                "peso": "1.0"
            }
        },
        {
            "cels": {
                "x-1y-1": {},
                "x-1y-2": {},
                "x-1y1": {},
                "x-1y2": {},
                "x-2y-1": {},
                "x-2y0": {},
                "x-2y1": {},
                "x0y-2": {},
                "x0y2": {},
                "x1y-1": {},
                "x1y-2": {},
                "x1y1": {},
                "x1y2": {},
                "x2y-1": {},
                "x2y0": {},
                "x2y1": {}
            },
            "data": {
                "densidad": "1.0",
                "peso": "0.6"
            }
        },
        {
            "cels": {
                "x-1y-3": {},
                "x-1y3": {},
                "x-2y-2": {},
                "x-2y-3": {},
                "x-2y2": {},
                "x-2y3": {},
                "x-3y-1": {},
                "x-3y-2": {},
                "x-3y0": {},
                "x-3y1": {},
                "x-3y2": {},
                "x0y-3": {},
                "x0y3": {},
                "x1y-3": {},
                "x1y3": {},
                "x2y-2": {},
                "x2y-3": {},
                "x2y2": {},
                "x2y3": {},
                "x3y-1": {},
                "x3y-2": {},
                "x3y0": {},
                "x3y1": {},
                "x3y2": {}
            },
            "data": {
                "densidad": "1.0",
                "peso": "-0.8"
            }
        },
        {
            "cels": {
                "x-1y-4": {},
                "x-1y-5": {},
                "x-2y-4": {},
                "x-2y-5": {},
                "x-3y-3": {},
                "x-3y-4": {},
                "x-3y-5": {},
                "x-4y-1": {},
                "x-4y-2": {},
                "x-4y-3": {},
                "x-4y-4": {},
                "x-4y-5": {},
                "x-5y-1": {},
                "x-5y-2": {},
                "x-5y-3": {},
                "x-5y-4": {},
                "x-6y-1": {},
                "x-6y-2": {}
            },
            "data": {
                "densidad": "0.3",
                "peso": "-0.2"
            }
        },
        {
            "cels": {
                "x0y-4": {},
                "x0y-5": {},
                "x1y-4": {},
                "x1y-5": {},
                "x2y-3": {},
                "x2y-4": {},
                "x2y-5": {},
                "x3y-3": {},
                "x3y-4": {},
                "x3y-5": {},
                "x4y-1": {},
                "x4y-2": {},
                "x4y-3": {},
                "x4y-4": {},
                "x4y0": {},
                "x5y-1": {},
                "x5y-2": {},
                "x5y-3": {},
                "x5y-4": {},
                "x5y0": {}
            },
            "data": {
                "densidad": "0.3",
                "peso": "-0.2"
            }
        },
        {
            "cels": {
                "x0y4": {},
                "x0y5": {},
                "x1y4": {},
                "x1y5": {},
                "x1y6": {},
                "x2y4": {},
                "x2y5": {},
                "x2y6": {},
                "x3y1": {},
                "x3y2": {},
                "x3y3": {},
                "x3y4": {},
                "x3y5": {},
                "x3y6": {},
                "x4y1": {},
                "x4y2": {},
                "x4y3": {},
                "x4y4": {},
                "x4y5": {},
                "x5y1": {},
                "x5y2": {}
            },
            "data": {
                "densidad": "0.3",
                "peso": "-0.2"
            }
        },
        {
            "cels": {
                "x-1y4": {},
                "x-1y5": {},
                "x-1y6": {},
                "x-2y4": {},
                "x-2y5": {},
                "x-2y6": {},
                "x-3y3": {},
                "x-3y4": {},
                "x-3y5": {},
                "x-4y2": {},
                "x-4y3": {},
                "x-4y4": {},
                "x-4y5": {},
                "x-5y0": {},
                "x-5y1": {},
                "x-5y2": {},
                "x-5y3": {},
                "x-5y4": {},
                "x-6y0": {},
                "x-6y1": {},
                "x-6y2": {},
                "x-6y3": {},
                "x0y5": {},
                "x0y6": {}
            },
            "data": {
                "densidad": "0.3",
                "peso": "-0.2"
            }
        }
    ],
    mini_feed_foward_inhibido: [
        {
            "cels": {
                                    "x-1y0":{},           "x1y0":{},
                                    "x-1y1":{}, "x0y1":{},"x1y1":{},
            },
            "data": {
                "densidad": "1.0",
                "peso": "1.0"
            }
        },
        {
            "cels": {
                "x-3y0":{},"x-2y0":{},                                 "x2y0":{},"x3y0":{},
                "x-3y1":{},"x-2y1":{},                                 "x2y1":{},"x3y1":{},
            },
            "data": {
                "densidad": "1.0",
                "peso": "-1.0"
            }
        }
    ],
    mini_debug: [{"data":null,"cels":{"x-1y-1":{"data":{}},"x-1y0":{"data":{}},"x-1y1":{"data":{}},"x0y-1":{"data":{}},"x0y1":{"data":{}},"x1y-1":{"data":{}},"x1y0":{"data":{}},"x1y1":{"data":{}}}}]
    ,
    lvq: [{"data":{"densidad":"1.0","peso":"1.0"},"cels":{"x-1y0":{},"x1y0":{},"x-4y0":{"data":{}},"x-3y0":{"data":{}},"x-2y0":{"data":{}},"x2y0":{"data":{}},"x3y0":{"data":{}},"x4y0":{"data":{}}}},{"data":{"densidad":"1.0","peso":"-1.0"},"cels":{"x-20y0":{"data":{}},"x-19y0":{"data":{}},"x-18y0":{"data":{}},"x-17y0":{"data":{}},"x-16y0":{"data":{}},"x-15y0":{"data":{}},"x-14y0":{"data":{}},"x-13y0":{"data":{}},"x-11y0":{"data":{}},"x-10y0":{"data":{}},"x-9y0":{"data":{}},"x-8y0":{"data":{}},"x-7y0":{"data":{}},"x-6y0":{"data":{}},"x-5y0":{"data":{}},"x5y0":{"data":{}},"x6y0":{"data":{}},"x7y0":{"data":{}},"x8y0":{"data":{}},"x9y0":{"data":{}},"x10y0":{"data":{}},"x11y0":{"data":{}},"x-12y0":{"data":{}},"x12y0":{"data":{}},"x13y0":{"data":{}},"x14y0":{"data":{}},"x15y0":{"data":{}},"x16y0":{"data":{}},"x17y0":{"data":{}},"x18y0":{"data":{}},"x19y0":{"data":{}},"x20y0":{"data":{}},"x21y0":{"data":{}},"x22y0":{"data":{}},"x23y0":{"data":{}},"x24y0":{"data":{}},"x25y0":{"data":{}}}}]
    ,
    kohonen_simple: [{"data":null,"cels":{"x-1y-1":{"data":{}},"x-1y0":{"data":{}},"x-1y1":{"data":{}},"x0y-1":{"data":{}},"x0y1":{"data":{}},"x1y-1":{"data":{}},"x1y0":{"data":{}},"x1y1":{"data":{}}}},{"data":{"peso":"-1.0","densidad":"1.0"},"cels":{"x2y-4":{"data":{}},"x2y-3":{"data":{}},"x2y-2":{"data":{}},"x3y-4":{"data":{}},"x3y-3":{"data":{}},"x3y-2":{"data":{}},"x4y-4":{"data":{}},"x4y-3":{"data":{}},"x4y-2":{"data":{}}}},{"data":{"peso":"-1.0","densidad":"1.0"},"cels":{"x2y-1":{"data":{}},"x2y0":{"data":{}},"x2y1":{"data":{}},"x3y-1":{"data":{}},"x3y0":{"data":{}},"x3y1":{"data":{}},"x4y-1":{"data":{}},"x4y0":{"data":{}},"x4y1":{"data":{}}}},{"data":{"peso":"-1.0","densidad":"1.0"},"cels":{"x2y2":{"data":{}},"x2y3":{"data":{}},"x2y4":{"data":{}},"x3y2":{"data":{}},"x3y3":{"data":{}},"x3y4":{"data":{}},"x4y2":{"data":{}},"x4y3":{"data":{}},"x4y4":{"data":{}}}},{"data":{"peso":"-1.0","densidad":"1.0"},"cels":{"x-1y3":{"data":{}},"x-1y4":{"data":{}},"x0y3":{"data":{}},"x0y4":{"data":{}},"x1y3":{"data":{}},"x1y4":{"data":{}},"x-1y2":{"data":{}},"x0y2":{"data":{}},"x1y2":{"data":{}}}},{"data":{"peso":"-1.0","densidad":"1.0"},"cels":{"x-4y2":{"data":{}},"x-4y3":{"data":{}},"x-4y4":{"data":{}},"x-3y2":{"data":{}},"x-3y3":{"data":{}},"x-3y4":{"data":{}},"x-2y2":{"data":{}},"x-2y3":{"data":{}},"x-2y4":{"data":{}}}},{"data":{"peso":"-1.0","densidad":"1.0"},"cels":{"x-4y-1":{"data":{}},"x-4y0":{"data":{}},"x-4y1":{"data":{}},"x-3y-1":{"data":{}},"x-3y0":{"data":{}},"x-3y1":{"data":{}},"x-2y-1":{"data":{}},"x-2y0":{"data":{}},"x-2y1":{"data":{}}}},{"data":{"peso":"-1.0","densidad":"1.0"},"cels":{"x-4y-4":{"data":{}},"x-4y-3":{"data":{}},"x-4y-2":{"data":{}},"x-3y-4":{"data":{}},"x-3y-3":{"data":{}},"x-3y-2":{"data":{}},"x-2y-4":{"data":{}},"x-2y-3":{"data":{}},"x-2y-2":{"data":{}}}},{"data":{"peso":"-1.0","densidad":"1.0"},"cels":{"x-1y-4":{"data":{}},"x-1y-3":{"data":{}},"x-1y-2":{"data":{}},"x0y-4":{"data":{}},"x0y-3":{"data":{}},"x0y-2":{"data":{}},"x1y-4":{"data":{}},"x1y-3":{"data":{}},"x1y-2":{"data":{}}}}]
    ,
    kohonen_simple_espaciado: [{"data":null,"cels":{"x-1y-1":{"data":{}},"x-1y0":{"data":{}},"x-1y1":{"data":{}},"x0y-1":{"data":{}},"x0y1":{"data":{}},"x1y-1":{"data":{}},"x1y0":{"data":{}},"x1y1":{"data":{}}}},{"data":{"peso":"-1.0","densidad":"1.0"},"cels":{"x4y-1":{"data":{}},"x4y0":{"data":{}},"x4y1":{"data":{}},"x5y-1":{"data":{}},"x5y0":{"data":{}},"x5y1":{"data":{}},"x6y-1":{"data":{}},"x6y0":{"data":{}},"x6y1":{"data":{}}}},{"data":{"peso":"-1.0","densidad":"1.0"},"cels":{"x4y-6":{"data":{}},"x4y-5":{"data":{}},"x4y-4":{"data":{}},"x5y-6":{"data":{}},"x5y-5":{"data":{}},"x5y-4":{"data":{}},"x6y-6":{"data":{}},"x6y-5":{"data":{}},"x6y-4":{"data":{}}}},{"data":{"peso":"-1.0","densidad":"1.0"},"cels":{"x-1y-6":{"data":{}},"x-1y-5":{"data":{}},"x-1y-4":{"data":{}},"x0y-6":{"data":{}},"x0y-5":{"data":{}},"x0y-4":{"data":{}},"x1y-6":{"data":{}},"x1y-5":{"data":{}},"x1y-4":{"data":{}}}},{"data":{"peso":"-1.0","densidad":"1.0"},"cels":{"x-6y-6":{"data":{}},"x-6y-5":{"data":{}},"x-6y-4":{"data":{}},"x-5y-6":{"data":{}},"x-5y-5":{"data":{}},"x-5y-4":{"data":{}},"x-4y-6":{"data":{}},"x-4y-5":{"data":{}},"x-4y-4":{"data":{}}}},{"data":{"peso":"-1.0","densidad":"1.0"},"cels":{"x-6y-1":{"data":{}},"x-6y0":{"data":{}},"x-6y1":{"data":{}},"x-5y-1":{"data":{}},"x-5y0":{"data":{}},"x-5y1":{"data":{}},"x-4y-1":{"data":{}},"x-4y0":{"data":{}},"x-4y1":{"data":{}}}},{"data":{"peso":"-1.0","densidad":"1.0"},"cels":{"x-6y4":{"data":{}},"x-6y5":{"data":{}},"x-6y6":{"data":{}},"x-5y4":{"data":{}},"x-5y5":{"data":{}},"x-5y6":{"data":{}},"x-4y4":{"data":{}},"x-4y5":{"data":{}},"x-4y6":{"data":{}}}},{"data":{"peso":"-1.0","densidad":"1.0"},"cels":{"x-1y4":{"data":{}},"x-1y5":{"data":{}},"x-1y6":{"data":{}},"x0y4":{"data":{}},"x0y5":{"data":{}},"x0y6":{"data":{}},"x1y4":{"data":{}},"x1y5":{"data":{}},"x1y6":{"data":{}}}},{"data":{"peso":"-1.0","densidad":"1.0"},"cels":{"x4y4":{"data":{}},"x4y5":{"data":{}},"x4y6":{"data":{}},"x5y4":{"data":{}},"x5y5":{"data":{}},"x5y6":{"data":{}},"x6y4":{"data":{}},"x6y5":{"data":{}},"x6y6":{"data":{}}}}]
    ,
    kohonen_sparced: [{"data":{"peso":"PESO_DENDRITA_CERCANA","densidad":"1.0"},"cels":{"x-1y-1":{"data":{}},"x-1y0":{"data":{}},"x-1y1":{"data":{}},"x0y-1":{"data":{}},"x0y1":{"data":{}},"x1y-1":{"data":{}},"x1y0":{"data":{}},"x1y1":{"data":{}}}},{"data":{"peso":"PESO_DENDRITA_INHIBIDORA","densidad":"1.0"},"cels":{"x3y-3":{"data":{}}}},{"data":{"peso":"PESO_DENDRITA_INHIBIDORA","densidad":"1.0"},"cels":{"x3y3":{"data":{}}}},{"data":{"peso":"PESO_DENDRITA_INHIBIDORA","densidad":"1.0"},"cels":{"x-3y3":{"data":{}}}},{"data":{"peso":"PESO_DENDRITA_INHIBIDORA","densidad":"1.0"},"cels":{"x-3y-3":{"data":{}}}},{"data":{"peso":"PESO_DENDRITA_INHIBIDORA","densidad":"1.0"},"cels":{"x-5y-5":{"data":{}}}},{"data":{"peso":"PESO_DENDRITA_INHIBIDORA","densidad":"1.0"},"cels":{"x5y-5":{"data":{}}}},{"data":{"peso":"PESO_DENDRITA_INHIBIDORA","densidad":"1.0"},"cels":{"x5y5":{"data":{}}}},{"data":{"peso":"PESO_DENDRITA_INHIBIDORA","densidad":"1.0"},"cels":{"x-5y5":{"data":{}}}},{"data":{"peso":"PESO_DENDRITA_INHIBIDORA","densidad":"1.0"},"cels":{"x-5y0":{"data":{}}}},{"data":{"peso":"PESO_DENDRITA_INHIBIDORA","densidad":"1.0"},"cels":{"x5y0":{"data":{}}}},{"data":{"peso":"PESO_DENDRITA_INHIBIDORA","densidad":"1.0"},"cels":{"x0y-5":{"data":{}}}},{"data":{"peso":"PESO_DENDRITA_INHIBIDORA","densidad":"1.0"},"cels":{"x0y5":{"data":{}}}}]
}
