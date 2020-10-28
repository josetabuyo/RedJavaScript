$(function(){

  red.regiones["PIRULI"]={};
  red.regiones["POCHOCLO"]={};
  red.regiones["CACHUKLY"]={};




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
    });

    domRegion.insertBefore('#addRegion');
  }



  for(region in red.regiones){
    addRegion(region);
  };


  $('#addRegion').on('click', function(){
    var region = "CACHUKL_" + Object.keys(red.regiones).length;
    red.regiones[region]={};
    addRegion(region);
  });

});
