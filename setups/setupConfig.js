

var configSlyCoef = function(_coef, escala) {



	var newLi = $('#template_sly').clone()
			.attr('id', _coef +'_container')
			.removeClass('template')
			;

	newLi.find('div.sly_ref').text(_coef);

	var objSly = newLi.find('input.sly_input')

	objSly.attr('id', _coef);



	if(!escala)escala=1;


	objSly.change(function(){
		var value = ($(this).val() / 255);
		value = value / escala;

		config[_coef] = parseFloat(value.toFixed(3));

		$(this).siblings().text(_coef + ": " + config[_coef]);
	});

	objSly.val(config[_coef] * escala * 255);
	objSly.siblings().text(_coef + ": " + config[_coef]);


	return newLi;
};


var setControlCoeficientes = function(){

	$('#control #coeficientes').empty();

	$('#control #coeficientes').append(configSlyCoef("COEF_SINAPSIS_ENTRENAMIENTO", 100));
	$('#control #coeficientes').append(configSlyCoef("COEF_SINAPSIS_UMBRAL_PESO"));
	$('#control #coeficientes').append(configSlyCoef("COEF_NEURONA_UMBRAL_ACTIVACION", .1));
	$('#control #coeficientes').append(configSlyCoef("PESO_DENDRITA_CERCANA"));
	$('#control #coeficientes').append(configSlyCoef("PESO_DENDRITA_INHIBIDORA", -1));
	$('#control #coeficientes').append(configSlyCoef("PESO_DENDRITA_ENTRADA"));

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

				<ul id="coeficientes" />




				<li id="template_sly" class="template sly">
					<div class="sly_ref">
					</div>
					<input class="sly_input" type="range" min="0" max="255" value="100" />
				</li>

			</div>
		</div>
	`);



	setControlCoeficientes();


});
