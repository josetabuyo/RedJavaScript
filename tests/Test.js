

class Test {

  constructor (){

    this.onStep_vEventos = [];

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

  play(){
    var test = this;


    if(!test.running){

      //drawVisual = requestAnimationFrame(test.step);

      test.testInterval = setInterval(function (){
        test.step();
      }, 0);


      test.running = true;
    }

  }


  step() {

    test.red.procesar();
    test.onStep();
  }

  stop(){
    var test = this;
    clearInterval(test.testInterval);
    test.running = false;
  }


}
