describe("Filtros", function() {
    var un_filtro_desconocido;
    var un_filtro_true;
    var un_filtro_false;
    var un_filtro_por_clave1_valor1;
    var un_filtro_por_clave2_valor2;
    var un_des_serializador;
    
    beforeEach(function() {
        un_filtro_desconocido = new FiltroDesconocido();
        un_filtro_true = new FiltroTrue();
        un_filtro_false = new FiltroFalse();
        un_filtro_por_clave1_valor1 = new FiltroXClaveValor('Clave1', 'Valor1');
        un_filtro_por_clave2_valor2 = new FiltroXClaveValor('Clave2', 'Valor2');
    
    });
    
    it("1 - La AND de un filtro desconocido y uno true deberia devolver undefined", function() {
        var resultado = new FiltroAND([un_filtro_true, un_filtro_desconocido]).eval("fruta");
        expect(resultado).toEqual(undefined);
    });

    it("2 - La AND de un filtro desconocido y uno false deberia devolver false", function() {
        var resultado = new FiltroAND([un_filtro_false, un_filtro_desconocido]).eval("fruta");
        expect(resultado).toEqual(false);
    });
    
    it("3 - La OR de un filtro desconocido y uno false deberia devolver undefined", function() {
        var resultado = new FiltroOR([un_filtro_false, un_filtro_desconocido]).eval("fruta");
        expect(resultado).toEqual(undefined);
    });

    it("4 - La OR de un filtro desconocido y uno true deberia devolver true", function() {
        var resultado = new FiltroOR([un_filtro_true, un_filtro_desconocido]).eval("fruta");
        expect(resultado).toEqual(true);
    });
    
    it("5 - Al serializar y desserializar un filtro deberia seguir comportandose igual", function() {
        var filtroSerializado = un_filtro_por_clave1_valor1.serializar();
        var filtroDesSerializado = DesSerializadorDeFiltros.desSerializarFiltro(filtroSerializado);
        
        expect(un_filtro_por_clave1_valor1.eval({'Clave1':'Valor1'})).toEqual(true);
        expect(un_filtro_por_clave1_valor1.eval({'Clave2':'Valor2'})).toEqual(false);
        expect(filtroDesSerializado.eval({'Clave1':'Valor1'})).toEqual(true);
        expect(filtroDesSerializado.eval({'Clave2':'Valor2'})).toEqual(false);
    });
    
    it("6 - Si simplifico una AND de un solo filtro deberia quedarme el filtro de adentro de la AND como resultado", function() {
        var filtro_1 = new FiltroXClaveValor("clave1", 1);
        var filtro_and_1 = new FiltroAND([filtro_1]);
        
        expect(filtro_and_1.simplificar().equals(filtro_1)).toBeTruthy();
    });
    
    it("7 - Si simplifico una OR de un solo filtro deberia quedarme el filtro de adentro de la OR como resultado", function() {
        var filtro_1 = new FiltroXClaveValor("clave1", 1);
        var filtro_or_1 = new FiltroOR([filtro_1]);
        
        expect(filtro_or_1.simplificar().equals(filtro_1)).toBeTruthy();
    });
    it("8 - Si en un filtro AND pongo otro filtro AND y simplifico el primero deberian quedar los filtros del segundo al mismo nivel que los del primero", function() {
        var filtro_1 = new FiltroXClaveValor("clave1", 1);
        var filtro_2 = new FiltroXClaveValor("clave2", 2);
        var filtro_3 = new FiltroXClaveValor("clave3", 3);
        
        var filtro_and_2 = new FiltroAND([filtro_1, filtro_2]);
        var filtro_and_1 = new FiltroAND([filtro_and_2, filtro_3]);
        
        expect(filtro_and_1.simplificar().filtros.length).toEqual(3);
    });
    
    it("9 - Si simplifico una AND vacia deberia quedarme un filtro FALSE como resultado", function() {
        var filtro_and_1 = new FiltroAND([]);        
        expect(filtro_and_1.simplificar().equals(un_filtro_false)).toBeTruthy();
    });
    
    it("10 - Si simplifico una OR vacia deberia quedarme un filtro FALSE como resultado", function() {
        var filtro_or_1 = new FiltroOR([]);        
        expect(filtro_or_1.simplificar().equals(un_filtro_false)).toBeTruthy();
    });
    
    it("11 - Un filtro TRUE deberia ser igual a otro filtro TRUE", function() {
        expect(new FiltroTrue().equals(new FiltroTrue())).toBeTruthy();
    });
    
    it("12 - Un filtro TRUE deberia ser distinto a un filtro FALSE", function() {
        expect(new FiltroTrue().equals(new FiltroFalse())).toBeFalsy();
    });
    
    it("13 - Un filtro FALSE deberia ser igual a otro filtro FALSE", function() {
        expect(new FiltroFalse().equals(new FiltroFalse())).toBeTruthy();
    });
    
    it("14 - Un filtro Equals deberia ser igual a otro filtro Equals con mismo clave-valor", function() {
        expect(new FiltroXClaveValor("clave1", 1).equals(new FiltroXClaveValor("clave1", 1))).toBeTruthy();
    });
    
    it("15 - Un filtro Equals deberia ser distinto a otro filtro Equals con mismo clave-valor", function() {
        expect(new FiltroXClaveValor("clave1", 1).equals(new FiltroXClaveValor("clave1", 2))).toBeFalsy();
    });
    
    it("16 - Un filtro AND deberia ser igual a otro filtro AND con los mismos elementos en cualquier orden", function() {
        var filtro_1 = new FiltroXClaveValor("clave1", 1);
        var filtro_2 = new FiltroXClaveValor("clave2", 2);
        var filtro_3 = new FiltroXClaveValor("clave1", 1);
        var filtro_4 = new FiltroXClaveValor("clave2", 2);
        
        var filtro_and_1 = new FiltroAND([filtro_1, filtro_2]);
        var filtro_and_2 = new FiltroAND([filtro_4, filtro_3]);
        
        expect(filtro_and_1.equals(filtro_and_2)).toBeTruthy();
    });
    
    it("17 - Un filtro AND deberia ser distinto a otro filtro AND con distintos elementos", function() {
        var filtro_1 = new FiltroXClaveValor("clave1", 1);
        var filtro_2 = new FiltroXClaveValor("clave2", 2);
        var filtro_3 = new FiltroXClaveValor("clave1", 2);
        var filtro_4 = new FiltroXClaveValor("clave2", 2);
        
        var filtro_and_1 = new FiltroAND([filtro_1, filtro_2]);
        var filtro_and_2 = new FiltroAND([filtro_4, filtro_3]);
        
        expect(filtro_and_1.equals(filtro_and_2)).toBeFalsy();
    });
    
    it("18 - Un filtro OR deberia ser igual a otro filtro OR con los mismos elementos en cualquier orden", function() {
        var filtro_1 = new FiltroXClaveValor("clave1", 1);
        var filtro_2 = new FiltroXClaveValor("clave2", 2);
        var filtro_3 = new FiltroXClaveValor("clave1", 1);
        var filtro_4 = new FiltroXClaveValor("clave2", 2);
        
        var filtro_or_1 = new FiltroOR([filtro_1, filtro_2]);
        var filtro_or_2 = new FiltroOR([filtro_4, filtro_3]);
        
        expect(filtro_or_1.equals(filtro_or_2)).toBeTruthy();
    });
    
    it("19 - Un filtro OR deberia ser distinto a otro filtro OR con distintos elementos", function() {
        var filtro_1 = new FiltroXClaveValor("clave1", 1);
        var filtro_2 = new FiltroXClaveValor("clave2", 2);
        var filtro_3 = new FiltroXClaveValor("clave1", 2);
        var filtro_4 = new FiltroXClaveValor("clave2", 2);
        
        var filtro_or_1 = new FiltroOR([filtro_1, filtro_2]);
        var filtro_or_2 = new FiltroOR([filtro_4, filtro_3]);
        
        expect(filtro_or_1.equals(filtro_or_2)).toBeFalsy();
    });
    
    it("20 - Si simplifico una OR con un filtro TRUE dentro de sus filtros deberia quedar un filtro TRUE como resultado", function() {
        var un_filtro_or = new FiltroOR([new FiltroTrue(), new FiltroXClaveValor("clave1", 1)]);               
        expect(un_filtro_or.simplificar().equals(un_filtro_true)).toBeTruthy();
    });
    
    it("21 - Al simplificar una OR se deberian descartar los filtros repetidos", function() {
        
        var un_filtro_or = new FiltroOR([new FiltroXClaveValor("clave1", 1), 
                                         new FiltroXClaveValor("clave1", 1),
                                         new FiltroXClaveValor("clave2", 2)]);
        
        var otro_filtro_or = new FiltroOR([new FiltroXClaveValor("clave1", 1),
                                           new FiltroXClaveValor("clave2", 2)]);
        
        expect(un_filtro_or.simplificar().equals(otro_filtro_or)).toBeTruthy();
        expect(un_filtro_or.simplificar().equals(un_filtro_or)).toBeFalsy();
    });
    
    it("22 - Al simplificar una AND se deberian descartar los filtros repetidos", function() {
        
        var un_filtro_and = new FiltroAND([new FiltroXClaveValor("clave1", 1), 
                                          new FiltroXClaveValor("clave1", 1),
                                          new FiltroXClaveValor("clave2", 2)]);
        
        var otro_filtro_and = new FiltroAND([new FiltroXClaveValor("clave1", 1),
                                             new FiltroXClaveValor("clave2", 2)]);
        
        expect(un_filtro_and.simplificar().equals(otro_filtro_and)).toBeTruthy();
        expect(un_filtro_and.simplificar().equals(un_filtro_and)).toBeFalsy();
    });
	
    it("23 - Un filtro X Ejemplo deberia ser igual a otro filtro X Ejemplo con el mismo ejemplo", function() {
        expect(new FiltroXEjemplo({p1: 1, p2:2}).equals(new FiltroXEjemplo({p1: 1, p2:2}))).toBeTruthy();
    });
	
	it("24 - Un filtro X Ejemplo deberia evaluar positivamente mensajes que contienen todas las claves y valores de un ejemplo", function() {
        expect(new FiltroXEjemplo({p1: 1, p2:2}).eval({p1: 1, p2:2, p3:3})).toBeTruthy();
    });
	
	it("25 - Un filtro X Ejemplo deberia evaluar negativamente mensajes que no contienen todas las claves y valores de un ejemplo", function() {
        expect(new FiltroXEjemplo({p1: 1, p2:2}).eval({p1: 1, p3:3})).toBeFalsy();
    });
    
    it("26 - Al simplificar una OR que contiene dos filtros por ejemplo que se incluyen  debería quedar solo el mas general", function() {
        var un_filtro_or = new FiltroOR([new FiltroXEjemplo({p1:1, p2:2}), 
                                         new FiltroXEjemplo({p1:1}),
                                         new FiltroXEjemplo({p3:3})]);
              
        expect(un_filtro_or.simplificar().equals(new FiltroOR([new FiltroXEjemplo({p1:1}), new FiltroXEjemplo({p3:3})]))).toBeTruthy();
    });
	
	it("27 - Al simplificar una OR que contiene tres false deberia quedarme solo un filtro false", function() {
        var un_filtro_or = new FiltroOR([new FiltroFalse(), 
                                         new FiltroFalse(),
                                         new FiltroFalse()]);
              
        expect(un_filtro_or.simplificar().equals(new FiltroFalse())).toBeTruthy();
    });
});