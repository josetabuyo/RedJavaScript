class TestDummy extends Test{

  start (opt){
    var test =  this;

    // Ugly, this is the contructor of the class

    $.extend(test, {
        // here extra porperties
    }, opt);

    test.onStep_vEventos = [];
    
  }

  step() {
    super.step();
  }

}





/************** :TEST: ************/
$(function(){
  $('#tests>.toolbar select').append("<option value='TestDummy'>TestDummy</option>");
  $('#tests>.body').empty()
});
