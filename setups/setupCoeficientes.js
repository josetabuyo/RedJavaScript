

var configSlyCoef = function(coef, nameSly, escala) {


	if(!escala)escala=1;

	var objSly = $('#'+ nameSly);


	objSly.change(function(){
		var value = ($(this).val() / 255);
		value = value / escala;


		coef = value.toFixed(3);

		$(this).siblings().text(nameSly + ": " + coef);
	});

	objSly.val(coef * escala * 255);
	objSly.siblings().text(nameSly + ": " + coef);
};


var setControlCoeficientes = function(){
	configSlyCoef(COEF_SINAPSIS_ENTRENAMIENTO, "COEF_SINAPSIS_ENTRENAMIENTO", 100);
	configSlyCoef(COEF_SINAPSIS_UMBRAL_PESO, "COEF_SINAPSIS_UMBRAL_PESO");
};



$(function(){

  $('#leftContainer').append(`
		<div id="control" class="container">
			<div class="toolbar">
				<div class="maximize boton botonLeft" title="Maximizar">
				#
				</div>
			</div>
			<div class="body">

				<ul id="coeficientes">
					<li id="COEF_SINAPSIS_ENTRENAMIENTO">COEF_SINAPSIS_ENTRENAMIENTO</li>
					<li id="COEF_SINAPSIS_UMBRAL_PESO">COEF_SINAPSIS_UMBRAL_PESO</li>
				<ul>

			</div>
		</div>
	`);

	$('#control #coeficientes>li').each(function(index, item){

		var nameSly = $(item).text();

		var newLi = $('#template_sly').clone()
				.attr('id', nameSly+'_container')
				.removeClass('template')
				;

		newLi.find('div.sly_ref').text(nameSly);

		newLi.find('input.sly_input').attr('id', nameSly);

		$(item).replaceWith(newLi)
	})

	setControlCoeficientes();


});
