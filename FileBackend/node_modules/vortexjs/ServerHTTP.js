var ServerHTTP = function(app){
	var Vortex = require("./Vortex");
	var Vx = Vortex.Vx;
    
    var allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    }
	app.use(allowCrossDomain);

    var pad = function (n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
    
    var sesiones_http = [];
    var ultimo_id_sesion_http = 0;  
        
    app.post('/create', function(request, response){
        var conector_http = new  Vortex.NodoSesionHTTP({
            id: pad(ultimo_id_sesion_http, 4),
            //verbose:true,
            app: app,
            alDesconectar: function(){
                sesiones_http.splice(sesiones_http.indexOf(conector_http), 1);
            }
        });
        ultimo_id_sesion_http+=1;
        sesiones_http.push(conector_http);
        Vx.conectarCon(conector_http);     
        response.send(conector_http.idSesion);
    });
};
exports.clase = ServerHTTP;