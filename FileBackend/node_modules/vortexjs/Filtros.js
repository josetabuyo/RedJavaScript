/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/

if(typeof(require) != "undefined"){
    var _ = require("./underscore-min");
}

var DesSerializadorDeFiltros = {
	desSerializarFiltro : function(un_filtro_serializado){
        var filtro;
		switch(un_filtro_serializado.tipo)
		{
            case 'EX':
				filtro =  new FiltroXEjemplo();
				break;
			case 'EQ':
				filtro =  new FiltroXClaveValor();
				break;
			case 'AND':
				filtro =  new FiltroAND();
				break;
            case 'OR':
				filtro =  new FiltroOR();
				break;
			case 'TRUE':
				filtro =  new FiltroTrue();
				break;
            case 'FALSE':
				filtro =  new FiltroFalse();
				break;
			default:
				filtro =  new FiltroDesconocido();
		}
		filtro.desSerializar(un_filtro_serializado);
		return filtro;
	}
};
if(typeof(require) != "undefined"){
    exports.DesSerializadorDeFiltros = DesSerializadorDeFiltros;
}

var FiltroXEjemplo = function (ejemplo) {
    this.ejemplo = ejemplo;
};
FiltroXEjemplo.prototype = {    
    eval : function (un_mensaje) {
		return _.isMatch(un_mensaje, this.ejemplo);
    },
	serializar : function(){
		return {
            'tipo': 'EX',
			'ejemplo': this.ejemplo
        };
	},
	desSerializar : function(un_filtro_serializado){
		this.ejemplo = un_filtro_serializado.ejemplo;
	},
    simplificar: function(){return this;},
    equals: function(otro_filtro){
        if(!(otro_filtro instanceof FiltroXEjemplo)) return false;
        return _.isEqual(this.ejemplo, otro_filtro.ejemplo);
    },
	contains: function(otro_filtro){
		if((otro_filtro instanceof FiltroXEjemplo)) return _.isMatch(otro_filtro.ejemplo, this.ejemplo);
		if((otro_filtro instanceof FiltroFalse)) return true;
		return false;
	}
};
if(typeof(require) != "undefined"){ exports.FiltroXEjemplo = FiltroXEjemplo;}


var FiltroXClaveValor = function (clave, valor) {
	this._clave = clave;
	this._valor = valor;
};
FiltroXClaveValor.prototype = {
    eval : function (un_mensaje) {
        return un_mensaje[this._clave] == this._valor;
    },
	serializar : function(){
		return {'tipo': 'EQ',
				'clave': this._clave, 
				'valor': this._valor};
	},
	desSerializar : function(un_filtro_serializado){
		this._clave = un_filtro_serializado.clave; 
		this._valor = un_filtro_serializado.valor; 
	},
    simplificar: function(){return this;},
    equals: function(otro_filtro){
        if(!(otro_filtro instanceof FiltroXClaveValor)) return false;
        return this._clave == otro_filtro._clave && this._valor == otro_filtro._valor;
    },
	contains: function(otro_filtro){
		if((otro_filtro instanceof FiltroXClaveValor)) return this._clave == otro_filtro._clave && this._valor == otro_filtro._valor;
		if((otro_filtro instanceof FiltroXEjemplo)) {
			if(otro_filtro.ejemplo[this._clave] == this._valor) return true;
		 }
		if((otro_filtro instanceof FiltroFalse)) return true;
		return false;
	}
};
if(typeof(require) != "undefined"){ exports.FiltroXClaveValor = FiltroXClaveValor;}


var FiltroAND = function (_filtros) {
	this.filtros = (_filtros === undefined)? [] : _filtros;
};
FiltroAND.prototype = {
    eval : function (un_mensaje) {
        var valorRetorno = true;
		for(var i=0; i<this.filtros.length; i++){
			var evaluacion = this.filtros[i].eval(un_mensaje);
			if (evaluacion == false) { 
				return false;
			}
			if (evaluacion === undefined) { 
				valorRetorno = undefined;
			}
		}
        return valorRetorno;
    },        
	serializar: function(){
		var ret = {	'tipo': 'AND',
					'filtros': []};
		for(var i=0; i<this.filtros.length; i++){
			ret.filtros.push(this.filtros[i].serializar());
		}		
		return ret;
	},	
	desSerializar: function(un_filtro_serializado){
		for(var i=0; i<un_filtro_serializado.filtros.length; i++){
			this.filtros.push(DesSerializadorDeFiltros.desSerializarFiltro(un_filtro_serializado.filtros[i]));
		}
	},
    simplificar: function(){
        var filtros_acumulados_simplificados = [];
        for(var i=0; i<this.filtros.length; i++){
			if(this.filtros[i] instanceof FiltroAND){
                for(var j=0; j<this.filtros[i].filtros.length; j++){
                    filtros_acumulados_simplificados.push(this.filtros[i].filtros[j].simplificar());
                }
            }else{
                filtros_acumulados_simplificados.push(this.filtros[i].simplificar());
            }
		}
        var filtros_sin_true = [];
        for(var i=0; i<filtros_acumulados_simplificados.length; i++){
            if(filtros_acumulados_simplificados[i] instanceof FiltroFalse) return filtros_acumulados_simplificados[i]; 
            if(!(filtros_acumulados_simplificados[i] instanceof FiltroTrue)) filtros_sin_true.push(filtros_acumulados_simplificados[i]); 
        }
        if(filtros_sin_true.length==1) return filtros_sin_true[0];
        if(filtros_sin_true.length==0) return new FiltroFalse;
        return new FiltroAND(filtros_sin_true).eliminarDuplicados();
    },
    eliminarDuplicados: function(){
        var filtro_sin_duplicados = new FiltroAND();
        for(var i=0; i<this.filtros.length; i++){
            if(!filtro_sin_duplicados.incluyeElFiltro(this.filtros[i])){
                filtro_sin_duplicados.filtros.push(this.filtros[i]);
            }
		}
        return filtro_sin_duplicados;
    },
    incluyeElFiltro: function(un_filtro){
        for(var i=0; i<this.filtros.length; i++){
            if(this.filtros[i].equals(un_filtro)) return true;
		}
        return false;
    },
    equals: function(otro_filtro){
        if(!(otro_filtro instanceof FiltroAND)) return false;
        if(otro_filtro.filtros.length != this.filtros.length) return false;
        for(var i=0; i<this.filtros.length; i++){
            if(!otro_filtro.incluyeElFiltro(this.filtros[i])) return false;
		}
        return true;
    },
	contains: function(otro_filtro){
		if((otro_filtro instanceof FiltroXClaveValor)) return this._clave == otro_filtro._clave && this._valor == otro_filtro._valor;
		if((otro_filtro instanceof FiltroXEjemplo)) {
			if(otro_filtro.ejemplo[this._clave] == this._valor) return true;
		 }
		if((otro_filtro instanceof FiltroFalse)) return true;
		return false;
	}
};
if(typeof(require) != "undefined"){ exports.FiltroAND = FiltroAND;}

var FiltroOR = function (_filtros) {
	this.filtros = (_filtros === undefined)? [] : _filtros;
};
FiltroOR.prototype = {    
    eval : function (un_mensaje) {
        var valorRetorno = false;
		for(var i=0; i<this.filtros.length; i++){
			var evaluacion = this.filtros[i].eval(un_mensaje);
			if (evaluacion == true) { 
				return true;
			}
			if (evaluacion === undefined) { 
				valorRetorno = undefined;
			}
		}
        return valorRetorno;
    },
	serializar: function(){
		var ret = {	'tipo': 'OR',
					'filtros': []};
		for(var i=0; i<this.filtros.length; i++){
			ret.filtros.push(this.filtros[i].serializar());
		}		
		return ret;
	},	
	desSerializar: function(un_filtro_serializado){
		for(var i=0; i<un_filtro_serializado.filtros.length; i++){
			this.filtros.push(DesSerializadorDeFiltros.desSerializarFiltro(un_filtro_serializado.filtros[i]));
		}
	},
    simplificar: function(){
        var filtros_acumulados_simplificados = [];
        for(var i=0; i<this.filtros.length; i++){
			var filtro_simplificado = this.filtros[i].simplificar();
			if(filtro_simplificado instanceof FiltroOR){
                for(var j=0; j<filtro_simplificado.filtros.length; j++){
                    filtros_acumulados_simplificados.push(filtro_simplificado.filtros[j]);
                }
            }else{
                filtros_acumulados_simplificados.push(filtro_simplificado);
            }
		}
		
		var filtros_mas_generales = _.where(filtros_acumulados_simplificados);		
		_.forEach(filtros_acumulados_simplificados, function(filtro1){
			_.forEach(filtros_acumulados_simplificados, function(filtro2){
				if(filtro1===filtro2) return;
				if(!_.contains(filtros_mas_generales, filtro1)) return;
				if(!_.contains(filtros_mas_generales, filtro2)) return;
				if(!filtro1.contains(filtro2)) return;
				filtros_mas_generales = _.reject(filtros_mas_generales, function(f){return f===filtro2;}); 
			});
		});			
		
        if(filtros_mas_generales.length==1) return filtros_mas_generales[0];
        if(filtros_mas_generales.length==0) return new FiltroFalse();
        return new FiltroOR(filtros_mas_generales);
    },
    eliminarDuplicados: function(){
        var filtro_sin_duplicados = new FiltroOR();
        for(var i=0; i<this.filtros.length; i++){
            if(!filtro_sin_duplicados.incluyeElFiltro(this.filtros[i])){
                filtro_sin_duplicados.filtros.push(this.filtros[i]);
            }
		}
        return filtro_sin_duplicados;
    },
    incluyeElFiltro: function(un_filtro){
        for(var i=0; i<this.filtros.length; i++){
            if(this.filtros[i].equals(un_filtro)) return true;
		}
        return false;
    },
    equals: function(otro_filtro){
        if(!(otro_filtro instanceof FiltroOR)) return false;
        if(otro_filtro.filtros.length != this.filtros.length) return false;
        for(var i=0; i<this.filtros.length; i++){
            if(!otro_filtro.incluyeElFiltro(this.filtros[i])) return false;
		}
        return true;
    },
	contains: function(otro_filtro){
		return false;
	}
};
if(typeof(require) != "undefined"){ exports.FiltroOR = FiltroOR;}

var FiltroDesconocido = function(){
    this.version_serializada = {'tipo': '?'};
};
FiltroDesconocido.prototype = {
	eval : function (un_mensaje) {
        return undefined;
    },    
    onChange : function(observador){
        this._observador = observador;
    },    
    serializar : function(){
		return this.version_serializada;
	},	
	desSerializar : function(un_filtro_serializado){
        this.version_serializada = un_filtro_serializado;
	},
    simplificar: function(){
		return this;
	},
	contains: function(otro_filtro){
		return false;
	}
};
if(typeof(require) != "undefined"){ exports.FiltroDesconocido = FiltroDesconocido;}

var FiltroTrue = function(){
};
FiltroTrue.prototype = {
	eval : function (un_mensaje) {
        return true;
    },    
    onChange : function(observador){
        this._observador = observador;
    },    
    serializar : function(){
		var ret = {	'tipo': 'TRUE'};
		return ret;
	},	
	desSerializar : function(un_filtro_serializado){
	},
    simplificar: function(){return this;},
    equals: function(otro_filtro){
        return (otro_filtro instanceof FiltroTrue);
    },
	contains: function(otro_filtro){
		return true;
	}
};
if(typeof(require) != "undefined"){ exports.FiltroTrue = FiltroTrue;}

var FiltroFalse = function(){
};
FiltroFalse.prototype = {
	eval : function (un_mensaje) {
        return false;
    },    
    onChange : function(observador){
        this._observador = observador;
    },    
    serializar : function(){
		var ret = {	'tipo': 'FALSE'};
		return ret;
	},	
	desSerializar :function(un_filtro_serializado){
	},
    simplificar: function(){return this;},
    equals: function(otro_filtro){
        return (otro_filtro instanceof FiltroFalse);
    },
	contains: function(otro_filtro){
		return (otro_filtro instanceof FiltroFalse);
	}
};
if(typeof(require) != "undefined"){ exports.FiltroFalse = FiltroFalse;}
