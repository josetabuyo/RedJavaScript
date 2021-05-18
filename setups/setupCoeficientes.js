

var configSlyCoef = function(coef, escala) {


	if(!escala)escala=1;

	var objSly = $('#'+ coef);


	objSly.change(function(){
		var value = ($(this).val() / 255);
		value = value / escala;

		window[coef] = parseFloat(value.toFixed(3));

		$(this).siblings().text(coef + ": " + window[coef]);
	});

	objSly.val(window[coef] * escala * 255);
	objSly.siblings().text(coef + ": " + window[coef]);
};


var setControlCoeficientes = function(){
	configSlyCoef("COEF_SINAPSIS_ENTRENAMIENTO", 100);
	configSlyCoef("COEF_SINAPSIS_UMBRAL_PESO");
	configSlyCoef("COEF_NEURONA_UMBRAL_ACTIVACION", .1);
};



$(function(){

  $('#leftContainer').append(`
		<style>
			li.sly{
				vertical-align: middle;
			}

			li.sly
			div.sly_ref{
				display: inline-block;
				width: 55%;
				height: 100%;
				font-size: 9px;
			}

			li.sly
			input.sly_input{
				position: relative;
				display: inline-block;
				left: 0%;
				width: 39%;
			}
		</style>

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
					<li id="COEF_NEURONA_UMBRAL_ACTIVACION">COEF_NEURONA_UMBRAL_ACTIVACION</li>
				<ul>

			</div>
		</div>
	`);

	$('#control #coeficientes>li').each(function(index, item){

		var coef = $(item).text();

		var newLi = $('#template_sly').clone()
				.attr('id', coef +'_container')
				.removeClass('template')
				;

		newLi.find('div.sly_ref').text(coef);

		newLi.find('input.sly_input').attr('id', coef);

		$(item).replaceWith(newLi)
	})

	setControlCoeficientes();


});
