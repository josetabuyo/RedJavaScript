class TestAudio extends Test{


	start(opt) {
		var test =  this;

		$.extend(test, {
			entrada: null,
			salida: null
		}, opt);



    if(Object.keys(test.red.neuronas).length == 0){
      alert("Debe existir al menos una neurona");
      return
    }



		navigator.mediaDevices.getUserMedia({ audio: true })
		.then(stream => {

			var audioContext = new AudioContext();
			// Create an AudioNode from the stream.
			var mediaStreamSource = audioContext.createMediaStreamSource( stream );


			test.analyser = audioContext.createAnalyser();




			// Connect it to the destination to hear yourself (or any other node for processing!)
			//mediaStreamSource.connect(audioContext.destination );



			mediaStreamSource.connect(test.analyser);

			test.analyser.fftSize = 256;
			var bufferLength = test.analyser.frequencyBinCount;

			test.dataArray = new Uint8Array(bufferLength);


			/*

			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorder.start();

			const audioChunks = [];
			mediaRecorder.addEventListener("dataavailable", event => {

				console.log(audioChunks)

				audioChunks.push(event.data);
			});

			mediaRecorder.addEventListener("stop", () => {
				const audioBlob = new Blob(audioChunks);
				const audioUrl = URL.createObjectURL(audioBlob);
				const audio = new Audio(audioUrl);
				audio.play();
			});

			setTimeout(() => {
				mediaRecorder.stop();
			}, 3000);

			*/

		});




		$('#TestAudio_Container').show();
	}

	step (){
		var test = this;

		test.printEntrada();

		super.step();
	}


	printEntrada(){
		var test = this;

		test.analyser.getByteFrequencyData(test.dataArray);


		if(Object.keys(red.regiones["ENTRADA"]).length = 0){
			return;
		}



		var index = 0;

		//Ponemos base de ruido
		for(var key in red.regiones["ENTRADA"]){

			var neurona = red.neuronas[key];

			if(test.noise){
				neurona.activarExternal(Math.random() * test.NOISE_LEVEL);
			}else{
				neurona.activarExternal(test.dataArray[index++]/255);
			}
		}
	}


}





/************** :TEST: ************/
$(function(){
  $('#tests>.body').append(`
		<style>
			#TestAudio_Container{
				border-color: Yellow;
			}

			#TestAudio_Container span{
				color: White;
				font-size: 30px;
				padding-left: 48px;
				padding-top: 24px;
			}
		</style>

		<div id="TestAudio_Container">
			<span>LISTENING</span>
		</div>
	`);

  $('#tests>.toolbar select').append("<option value='TestAudio'>TestAudio</option>");


  $("#tests #TestAudio_Container").hide()



});
