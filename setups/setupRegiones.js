$(function(){

  for(region in red.regiones){

    var domRegion = $('#plantilla_region').clone()
              .attr('id', 'region_' + region)
              ;
    domRegion.find(".region_ref").text(region);

    domRegion.on('click', function(){
      guiRed.region = $(this).find(".region_ref").text();
    });

    $('#regiones>ul').append(domRegion);

  }

});
