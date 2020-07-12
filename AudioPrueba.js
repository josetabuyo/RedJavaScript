
navigator.mediaDevices.getUserMedia({ audio: true })
.then(stream => {

	var audioContext = new AudioContext();
	// Create an AudioNode from the stream.
	var mediaStreamSource = audioContext.createMediaStreamSource( stream );

	var analyser = audioContext.createAnalyser();



	
	// Connect it to the destination to hear yourself (or any other node for processing!)
	//mediaStreamSource.connect(audioContext.destination );
	


	mediaStreamSource.connect(analyser);
	
	analyser.fftSize = 256;
	var bufferLength = analyser.frequencyBinCount;
	console.log(bufferLength);
	var dataArray = new Uint8Array(bufferLength);




	



	function draw() {
		drawVisual = requestAnimationFrame(draw);

		analyser.getByteFrequencyData(dataArray);
		console.log(dataArray);


		/*
		canvasCtx.fillStyle = 'rgb(0, 0, 0)';
		canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);


		var barWidth = (WIDTH / bufferLength) * 2.5;
		var barHeight;
		var x = 0;


		for(var i = 0; i < bufferLength; i++) {
			barHeight = dataArray[i]/2;

			canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
			canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);

			x += barWidth + 1;
		}


		*/
	};


	draw();








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


/*

canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);


function draw() {
	drawVisual = requestAnimationFrame(draw);

	
	canvasCtx.fillStyle = 'rgb(0, 0, 0)';
	canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);


	var barWidth = (WIDTH / bufferLength) * 2.5;
	var barHeight;
	var x = 0;


	for(var i = 0; i < bufferLength; i++) {
		barHeight = dataArray[i]/2;

		canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
		canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);

		x += barWidth + 1;
	}
};


draw();


*/