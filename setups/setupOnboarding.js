$(function(){


  $('#leftContainer').append(`

    <style>
      #onboarding{
        position: absolute;
        left: 0%;
        top: 0%;
        width: 50%;
        height: 20%;
        color: yellow;
        border: solid 3px;
        overflow: hidden;
      }

      #onboarding h1,p{
        margin-block-start: 0em;
        margin-block-end: 0em;
      }

      #help{
        color: #A9FFFE;

        position: absolute;
        right: 0%;
        top: 0%;

      }

    </style>


    <div id="onboarding" class="container">
      <h1>CNN4STAI</h1>

      <div id="help" class="boton">
        Help
      </div>
      <p>
        Connectionist Neural Network for Search of Total Artificial Intelligence
      </p>

    </div>

  `);


	console.log('*****************************************************');
	console.log('HELLO Red Neuronal HELLO - en Javascript by joZbuyo');
	console.log('*****************************************************');
	console.log('');
	console.log('*Probá escribiendo "red;" en la consola, si querés');
	console.log('');
	console.log('HELP:');
	console.log('https://github.com/josetabuyo/RedJavaScript/blob/master/README.md');
	console.log('');








	$('#help').on('click', function(){
		window.location="https://github.com/josetabuyo/RedJavaScript/blob/master/README.md";
	});





});
