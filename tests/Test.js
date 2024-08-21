
var test;

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

  step() {
    
    test.onStep();
  }

}
