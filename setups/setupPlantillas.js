$(function(){
  $('body').append(`
    <style>
  		#plantillas{
  			display: none;
  		}
    </style>
    <div id="plantillas">
      <li id="plantilla_sly">
        <div class="sly_ref">
        </div>
        <input class="sly_input" type="range" min="0" max="255" value="100" />
      </li>
      <li id="plantilla_conectoma_dendrita" class="layer">
        <div class="idLayer">
        </div>
        <div class="data">
          <input class="conectoma_dendrita_data" value="1.0,1.0" type="text"/>
        </div>
      </li>
      <li id="plantilla_region" class="region">
        <div class="region_ref">
            Region #1
        </div>
      </li>
    </div>
  `);
});
