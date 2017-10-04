var GuiMatriz = function(opt){
	$.extend(this, {
		x: 15,
		y: 15,
		radioPincel: 3,
		drawObj: "rectangulo",
		escala: {
			x: 10,
			y: 10
		},
		backgroundColor: "#999999",
		strokeCellColor: "#550055",
		fillCellColor: "#000000",
		
		botonDrawMode_Selector: null,
		idSvg: null,
		snap: null,
		sel: {
			desde: null,
			hasta: null,
			box: null,
			idMap: 0
		},
		
		map: []
		
	}, opt);
	
	
	this.start();
};




GuiMatriz.prototype = {
	draw: {
		rectangulo:{
			load:function(gui){
				if(gui.sel.box) gui.sel.box.remove();
				
			},
			mousedown: function(e, gui){
				
				
				if(gui.sel.box) gui.sel.box.remove();
				
				gui.sel.box = gui.snap.rect(0, 0, 1, 1);
				
				gui.sel.box.attr({
					stroke: "#FF0000",
					"stroke-width": 2,
					id : "box",
					fill: "#FF0000",
					"fill-opacity": 0.3
				});
				
				gui.sel.desde = gui.coordByPixelPos(e.offsetX, e.offsetY);
				gui.sel.hasta = gui.sel.desde;
			},
			mousemove: function(e, gui){
				
				if(!gui.sel.box) return;
				
				gui.sel.hasta = gui.coordByPixelPos(e.offsetX, e.offsetY);
				
				
				
				var desde_pixel = gui.pixelPosByCoord(gui.sel.desde);
				var hasta_pixel = gui.pixelPosByCoord(gui.sel.hasta);
				
				
				if(desde_pixel.x > hasta_pixel.x ){
					var aux = desde_pixel.x;
					desde_pixel.x = hasta_pixel.x;
					hasta_pixel.x = aux;
				}
				
				if(desde_pixel.y > hasta_pixel.y ){
					var aux = desde_pixel.y;
					desde_pixel.y = hasta_pixel.y;
					hasta_pixel.y = aux;
				}
				
				
				//TODO: sacar snap svg. usar templates y jquery;
				// no se puede usar JQuery par svg!!!
				var box = gui.o.find('#box');
				
				box.attr({
					x: desde_pixel.x,
					y: desde_pixel.y,
					width: hasta_pixel.x - desde_pixel.x,
					height: hasta_pixel.y - desde_pixel.y
				});
			
			},
			mouseup: function(e, gui){
				
				if (e.button === 2) {
					gui.removeCell(gui.sel.desde, gui.sel.hasta);
				}else{
					gui.addCell(gui.sel.desde, gui.sel.hasta);
					
				}
				
				gui.sel.desde = null;
				gui.sel.hasta = null;
				
				gui.sel.box.remove();
				gui.sel.box = null;
			}
		},
		pincel:{
			load:function(gui){
				
				if(gui.sel.box) gui.sel.box.remove();
				
				gui.sel.box = gui.snap.rect(0, 0, gui.radioPincel * gui.escala.x, gui.radioPincel * gui.escala.y);
				
				gui.sel.box.attr({
					stroke: "#FF0000",
					"stroke-width": 2,
					id : "box",
					fill: "#FF0000",
					"fill-opacity": 0.3
				});
				
			},
			mousedown: function(e, gui){
				gui.isDrawing = true;
				this.mousemove(e, gui);
			},
			mousemove: function(e, gui){
				
				var pos = gui.coordByPixelPos(e.offsetX, e.offsetY);
				gui.sel.desde = {
					x: pos.x - gui.radioPincel,
					y: pos.y - gui.radioPincel
				};
				gui.sel.hasta = {
					x: pos.x + gui.radioPincel,
					y: pos.y + gui.radioPincel
				};
				
				

				if(gui.isDrawing){
					//pinto el cuadradito
					if (e.button === 2) {
						gui.removeCell(gui.sel.desde, gui.sel.hasta);
					}else{
						gui.addCell(gui.sel.desde, gui.sel.hasta);
						
					}
				}
				
				
				var desde_pixel = gui.pixelPosByCoord(gui.sel.desde);
				var hasta_pixel = gui.pixelPosByCoord(gui.sel.hasta);
				

				/*****************************
				/* INFO:
				 * Para que quede el box del "puntero" al final y no por debajo de las celdas
				 * lo borro y lo vuelvo a crear. hago un load()
				 *
				 * SVG ES MUY SIMPLE:
				 * no sé si está mal la verdad,
				 * se renderizan en el orden de aparición en el html.. en este caso el componente svg.
				 * es medio obvio que pase eso al renderizar,
				 * salvo que se haga una funcionalidad aparte para lograr la ilusión que logra el render de html cuando le movemos el z-index.
				 ******************************
				*/
				this.load(gui);
				
				/**/
				
				
				//TODO: sacar snap svg. usar templates y jquery;
				var box = gui.o.find('#box');
				
				box.attr({
					x: desde_pixel.x,
					y: desde_pixel.y,
					width: hasta_pixel.x - desde_pixel.x,
					height: hasta_pixel.y - desde_pixel.y
				});
				
				
				
				
				
			},
			mouseup: function(e, gui){
				gui.isDrawing = false;
			}
		}
	},
	
	start: function(){
		var gui = this;
		
		
		gui.o = $("#" + gui.idSvg);
		
		gui.snap = Snap("#" + gui.idSvg);
		
		
		gui.load();

		
		gui.setDrawMode(gui.drawObj);
		
		
		//inserto la idMap 0
		gui.addMap();
		
	},
	setDrawModeNext: function(){
		var gui = this;
		
		var i=0;
		
		while(Object.keys(gui.draw)[i] != gui.drawObj){i++}
		
		i++;
		if(i >= Object.keys(gui.draw).length){
			i=0;
		}
		
		gui.setDrawMode(Object.keys(gui.draw)[i]);
	},
	addMap: function(){
		this.map.push({});
		this.selMap(this.map.length-1);

		this.onAddMap(this, this.map.length-1);
	},
	selMap: function(idMap){
		this.sel.idMap = idMap;
		this.refresh();
	},
	setDrawMode: function(drawObj){
		
		var gui = this;
		gui.draw[drawObj].load(gui);
		
		gui.o.unbind();
		gui.o.mousedown(function(e){
			gui.draw[drawObj].mousedown(e, gui);
		});
		
		gui.o.mousemove(function(e){
			gui.draw[drawObj].mousemove(e, gui);
		});
		
		gui.o.mouseup(function(e){
			gui.draw[drawObj].mouseup(e, gui);
		});
		
		gui.drawObj = drawObj;
	},
	removeCell: function(desde, hasta){
		var gui = this;
		
		if(((desde.x == hasta.x) && (desde.y == hasta.y)) || (!hasta)){
			gui.borrarCelda(pos);
		}else{
			gui.rectangulo(desde, hasta, function(pos){
				gui.borrarCelda(pos);
			});
		}
		
	},
	addCell: function(desde, hasta){
		var gui = this;
		
		if(((desde.x == hasta.x) && (desde.y == hasta.y)) || (!hasta)){
			gui.crearCelda(pos);
		}else{
			gui.rectangulo(desde, hasta, function(pos){
				gui.crearCelda(pos);
			});
		}
	},
	rectangulo: function(desde, hasta, callback){
		var gui = this;
		
		if(desde.x > hasta.x ){
			var aux = desde.x;
			desde.x = hasta.x;
			hasta.x = aux;
		}
		
		if(desde.y > hasta.y ){
			var aux = desde.y;
			desde.y = hasta.y;
			hasta.y = aux;
		}
		
		for(var i = desde.x; i < hasta.x; i++){
			for(var j = desde.y; j < hasta.y; j++){
				
				callback({x:i,y:j});
			}
		}
	},
	borrarCelda: function(pos){
		var gui = this;
		
		var key = "x"+pos.x+"y"+pos.y;
		
		if(typeof(gui.map[gui.sel.idMap][key]) == 'undefined'){
			return;
		}
		
		gui.map[gui.sel.idMap][key].remove();
		delete gui.map[gui.sel.idMap][key];
	},
	crearCelda: function(pos, idMap){
		var gui = this;
		
		if(typeof(idMap) == "undefined" ){
			idMap = gui.sel.idMap;
		};

		
		var key; 
		if(typeof(pos) == "string"){
			//MODO REFESH
			// no tiene validacion de existencia

			key = pos;

			var parts = key.split("y");

			parts[0] = parts[0].replace("x", "");
			

			pos = {
				x: parseInt(parts[0]),
				y: parseInt(parts[1])
			};


		}else{
			key = "x"+pos.x+"y"+pos.y;


			if((typeof(gui.map[gui.sel.idMap][key]) != 'undefined') || (pos.x == 0 && pos.y == 0)){
				return;
			}
		}
		
		
		var pos_pixel = gui.pixelPosByCoord(pos);
		
		
		var celda = gui.snap.rect(pos_pixel.x, pos_pixel.y, gui.escala.x, gui.escala.y).attr({
			fill: gui.fillCellColor,
			stroke: gui.strokeCellColor
		});

		
		gui.map[idMap][key] = celda;
		
	},
	coordByPixelPos: function(pixelPosX, pixelPosY){
		var gui = this;
		
		return {
			x: (Math.floor(pixelPosX / gui.escala.x ) - gui.x),
			y: (Math.floor(pixelPosY / gui.escala.y ) - gui.y)
		};
	},
	pixelPosByCoord: function(pos){
		var gui = this;
		
		return {
			x: (pos.x + gui.x) * gui.escala.x,
			y: (pos.y + gui.y) * gui.escala.y
		};
	},
	
	
	coordByPixelPos_String:function(pixelPosX, pixelPosY){

		var gui = this;
		
		var pos = gui.coordByPixelPos(pixelPosX, pixelPosY);
		
		return 'x'+pos.x+'y='+pos.y;
	},
	

	load: function(){
		var gui = this;

		gui.snap.clear();
		var ancho = gui.o.width();
		var alto = gui.o.height();
		
		var lienzo = gui.snap.rect(0, 0, ancho, alto).attr({
			fill: gui.backgroundColor,
			id: "lienzo"
		});
		
		var pos_pixel = gui.pixelPosByCoord({x:0,y:0});
		
		
		var celda = gui.snap.rect(pos_pixel.x, pos_pixel.y, gui.escala.x, gui.escala.y).attr({
			fill: "red",
			stroke: "red"
		});
	},
	refresh: function(){
		var gui = this;
		

		gui.load();


		gui.fillCellColor = "#FFFFFF";

		for(var idMap = 0; idMap < gui.map.length; idMap++){
			
			if(gui.sel.idMap != idMap){
				
				for(key in gui.map[idMap]){
					gui.crearCelda(key, idMap);
				}
				
			}
		}
		

		gui.fillCellColor = "#000000";

		for(key in gui.map[gui.sel.idMap]){
			gui.crearCelda(key);
		}
	}
	
}
	