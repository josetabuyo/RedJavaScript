var NodoRouter = require('./NodoRouter').clase;

var router = new NodoRouter();

console.log("publicando filtro");
router.when({p1:1}, function(msj){
	console.log("llego:", msj);
});

setInterval(function(){
	console.log("enviando mensaje");
	router.send({p1:1});
}, 1000);