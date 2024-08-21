class Runner {
  constructor(){
    this.running = false;
    this.runnerInterval = null;
    this.frameCount = 0;

  }
  
  run = () => {
    if(this.running){
      test.step();
      red.procesar();
      
      this.frameCount++;
      
      if (this.frameCount % 2 === 0) {
          guiRed.refresh();
      }
      
      requestAnimationFrame(this.run);
    }
  }

  play = () => {
    this.running = true;
    requestAnimationFrame(this.run);
  }
  stop = () => {
    this.running = false;
  }
  step = () => {
    test.step();
    red.procesar();
    guiRed.refresh();
  }

}

var runner = new Runner();


$(function(){

  $('#leftContainer').append(`

    <style>
      #runner{
        position: absolute;
        left: 0;
        top: 20%;
        width: 50%;
        height: 3%;
      }


      #runner #play{
        width: 60px;
      }
      #runner #play.play{
        background-color: #66AA66;
      }
      #runner #play.pause{
        background-color: #AA6666;
      }

    </style>



    <div id="runner" class="container">
      <div class="toolbar">
        <div id="play" class="boton play" title="Play o Pause al test continuo">
          Play
        </div>
        <div id="step" class="boton" title="Ejecuta solo un test">
          Step
        </div>
        <div class="maximize boton botonLeft" title="Maximizar">
				#
				</div>
      </div>
      <div class="body">
      </div>

    </div>

  `);
  
  $('#runner>.toolbar #step').on('click', function(){
    runner.step();
  });

  $('#runner>.toolbar #play').on('click', function(){
    
    var btn_play = $('#play');
    
    if(!runner.running){
      runner.play();

      btn_play.removeClass('play');
      btn_play.addClass('pause');
      btn_play.text('Pause');
    }else{
      runner.stop();
      
      btn_play.removeClass('pause');
      btn_play.addClass('play');
      btn_play.text('Play');
    }

  });



});
