/************** :TEST: ************/
var TestAudio = function(opt){
	$.extend(this, {
		entrada: null,
		salida: null
	}, opt);


	this.start();
};

TestAudio.prototype = {
	onStep_vEventos: [],
	onStep: function(param){
		if(typeof param == "function"){
			this.onStep_vEventos.push(param);
		}else{
			$.each(this.onStep_vEventos, function(index, value){
				value(param);
			});
		}
	},
	step:function(){
		var test = this;

		//drawVisual = requestAnimationFrame(test.step);


		test.printEntrada();
		test.red.procesar();


		test.onStep();
	},
	play: function(){
		var test = this;


		console.log(test.dataArray.length);



		if(!test.running){

			//drawVisual = requestAnimationFrame(test.step);


			test.testInterval = setInterval(function (){
				test.step();
			}, 0);


			test.running = true;
		}

	},

	stop: function(){
		clearInterval(this.testInterval);
		test.running = false;
	},
	start: function (){
		var test =  this;


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

	},

	printEntrada: function(){
		var test = this;

		test.analyser.getByteFrequencyData(test.dataArray);


		if(Object.keys(red.entrada).length = 0){
			return;
		}



		var index = 0;

		//Ponemos base de ruido
		for(key in red.entrada){

			var neurona = red.neuronas[key];

			if(test.noise){
				neurona.activarExternal(Math.random() * test.NOISE_LEVEL);
			}else{
				neurona.activarExternal(test.dataArray[index++]/255);
			}
		}
	}
};
