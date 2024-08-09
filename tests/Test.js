
var test;

class Test {

  constructor (){

    this.onStep_vEventos = [];
    this.onStop_vEventos = [];

  }

  play(){
    var test = this;
    
    if(!test.running){

      //drawVisual = requestAnimationFrame(test.step);

      test.testInterval = setInterval(function (){
        red.procesar();
        test.step();
      }, 0);


      test.running = true;
    }

  }

  onStep(param){
    var test = this;

    if(typeof param == "function"){
      test.onStep_vEventos.push(param);
    }else{
      $.each(test.onStep_vEventos, function(index, value){
        value(param);
      });
    }
  }

  step() {
    
    test.onStep();
  }

  onStop(param){
    var test = this;

    if(typeof param == "function"){
      test.onStop_vEventos.push(param);
    }else{
      $.each(test.onStop_vEventos, function(index, value){
        value(param);
      });
    }
  }
  stop(){
    var test = this;
    clearInterval(test.testInterval);
    test.running = false;
  }


}
