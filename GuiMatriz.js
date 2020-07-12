var GuiMatriz = function(opt){
	$.extend(this, {
		x: 0,
		y: 0,
		showCero: true,
		anchoPincel: 3,
		drawObj: "pincel",
		tool1:"addCell",
		tool2:"removeCell",
		escala: {
			x: 10,
			y: 10
		},
		backgroundColor: "#000000",
		strokeCellColor: "#550055",
		fillCellColor: "#000000",

		botonDrawMode_Selector: null,
		idSvg: null,
		snap: null,
		sel: {
			desde: null,
			hasta: null,
			box: null,
			idLayer: 0
		},

		defaultTemplate: [{"data":{"peso":0.2},"cels":{"x-1y-1":{},"x-1y0":{},"x-1y1":{},"x0y-1":{},"x0y1":{},"x1y-1":{},"x1y0":{},"x1y1":{}}}],
		//defaultTemplate: [{"data":{"peso":0.2},"cels":{"x-1y-1":{},"x-1y0":{},"x-1y1":{},"x0y-1":{},"x0y1":{}}},{"data":null,"cels":{"x0y-1":{},"x0y1":{},"x1y-1":{},"x1y0":{},"x1y1":{}}},{"data":null,"cels":{"x-1y0":{},"x-1y1":{},"x0y1":{},"x1y0":{},"x1y1":{}}},{"data":null,"cels":{"x-1y-1":{},"x-1y0":{},"x0y-1":{},"x1y-1":{},"x1y0":{}}},{"data":null,"cels":{"x-1y-3":{},"x-1y-2":{},"x0y-3":{},"x0y-2":{}}},{"data":null,"cels":{"x1y-3":{},"x1y-2":{},"x2y-3":{},"x2y-2":{}}},{"data":null,"cels":{"x2y-2":{},"x2y-1":{},"x3y-2":{},"x3y-1":{}}},{"data":null,"cels":{"x2y0":{},"x2y1":{},"x3y0":{},"x3y1":{}}},{"data":null,"cels":{"x2y1":{},"x2y2":{},"x3y1":{},"x3y2":{}}},{"data":null,"cels":{"x0y2":{},"x0y3":{},"x1y2":{},"x1y3":{}}},{"data":null,"cels":{"x-2y2":{},"x-2y3":{},"x-1y2":{},"x-1y3":{}}},{"data":null,"cels":{"x-3y1":{},"x-3y2":{},"x-2y1":{},"x-2y2":{}}},{"data":null,"cels":{"x-3y-1":{},"x-3y0":{},"x-2y-1":{},"x-2y0":{}}},{"data":null,"cels":{"x-3y-3":{},"x-3y-2":{},"x-2y-3":{},"x-2y-2":{}}},{"data":null,"cels":{"x-4y-5":{},"x-4y-4":{},"x-3y-5":{},"x-3y-4":{},"x-2y-5":{},"x-2y-4":{},"x-1y-5":{},"x-1y-4":{}}},{"data":null,"cels":{}},{"data":null,"cels":{"x0y-5":{},"x0y-4":{},"x1y-5":{},"x1y-4":{},"x2y-5":{},"x2y-4":{},"x3y-5":{},"x3y-4":{}}},{"data":null,"cels":{"x3y-4":{},"x3y-3":{},"x4y-4":{},"x4y-3":{},"x3y-2":{},"x4y-2":{},"x5y-3":{},"x5y-2":{},"x4y-1":{},"x5y-1":{}}},{"data":null,"cels":{"x4y0":{},"x4y1":{},"x5y0":{},"x5y1":{},"x4y2":{},"x5y2":{},"x4y3":{},"x5y3":{}}},{"data":null,"cels":{"x3y3":{},"x3y4":{},"x4y3":{},"x4y4":{},"x2y3":{},"x2y4":{},"x1y4":{},"x1y5":{},"x2y5":{},"x0y4":{},"x0y5":{}}},{"data":null,"cels":{"x-1y4":{},"x-1y5":{},"x0y4":{},"x0y5":{},"x-2y4":{},"x-2y5":{},"x-3y4":{},"x-3y5":{},"x-3y3":{},"x-2y3":{}}},{"data":null,"cels":{"x-5y3":{},"x-5y4":{},"x-4y3":{},"x-4y4":{},"x-3y3":{},"x-3y4":{},"x-5y2":{},"x-4y2":{},"x-5y1":{},"x-4y1":{}}},{"data":null,"cels":{"x-5y0":{},"x-5y1":{},"x-4y0":{},"x-4y1":{},"x-6y0":{},"x-6y1":{},"x-6y-1":{},"x-5y-1":{},"x-6y-2":{},"x-5y-2":{},"x-6y-3":{},"x-5y-3":{},"x-4y-3":{},"x-4y-2":{}}}],
		layers: []
	}, opt);


	this.start();
};




GuiMatriz.prototype = {
	draw: {
		pincel:{
			init:function(gui){

				if(gui.sel.box) gui.sel.box.remove();

				gui.sel.box = gui.snap.rect(0, 0, gui.anchoPincel * gui.escala.x, gui.anchoPincel * gui.escala.y);

				gui.sel.box.attr({
					stroke: "#FF0000",
					"stroke-width": 2,
					id : "box",
					fill: "#FF0000",
					"fill-opacity": 0.3
				});
			},
			mousedown: function(e, gui){
				gui.mousedown_event = e;
				this.mousemove(e, gui);
			},
			mousemove: function(e, gui){

				var pos = gui.coordByPixelPos(e.offsetX, e.offsetY);

				gui.sel.desde = {
					x: pos.x,
					y: pos.y
				};
				gui.sel.hasta = {
					x: pos.x + gui.anchoPincel,
					y: pos.y + gui.anchoPincel
				};



				if(gui.mousedown_event){
					gui.cellBox(gui.sel.desde, gui.sel.hasta, function(pos){

						if (gui.mousedown_event.button === 2) {
							gui[gui.tool2](pos);
						}else{
							gui[gui.tool1](pos);
						}
					});
				}


				var desde_pixel = gui.pixelPosByCoord(gui.sel.desde);
				var hasta_pixel = gui.pixelPosByCoord(gui.sel.hasta);


				this.init(gui);

				var box = gui.o.find('#box');

				box.attr({
					x: desde_pixel.x,
					y: desde_pixel.y,
					width: hasta_pixel.x - desde_pixel.x,
					height: hasta_pixel.y - desde_pixel.y
				});

			},
			mouseup: function(e, gui){
				gui.mousedown_event = false;
			}
		}
	},

	start: function(){
		var gui = this;


		gui.o = $("#" + gui.idSvg);

		gui.snap = Snap("#" + gui.idSvg);


		gui.init();


		gui.setDrawMode(gui.drawObj);


		//inserto la idLayer 0
		gui.addLayer();


		$('body').on('keydown', function(e){
			switch (e.which) {
				case 107:
					gui.setAnchoPincel("++");
					e.preventDefault();
					break;
				case 109:
					gui.setAnchoPincel("--");
					break;
			};
		});


	},
	setAnchoPincel: function(anchoPincel){
		var gui = this;

		if(anchoPincel=="++"){
			gui.anchoPincel++;
		}else if(anchoPincel=="--"){
			if(gui.anchoPincel>1)gui.anchoPincel--;
		}else{
			gui.anchoPincel=anchoPincel;
		}

		var box = gui.o.find('#box');

		box.attr({
			width: gui.anchoPincel * gui.escala.x,
			height: gui.anchoPincel * gui.escala.y
		});


	},
	init: function(){
		var gui = this;

		gui.snap.clear();


		var ancho = 1000; // gui.o.parent().width();
		var alto = 1000; // gui.o.parent().height();

		var lienzo = gui.snap.rect(0, 0, ancho, alto).attr({
			fill: gui.backgroundColor,
			id: "lienzo"
		});


		if(gui.showCero){
			var pos_pixel = gui.pixelPosByCoord({x:0,y:0});

			var cero = gui.snap.rect(pos_pixel.x, pos_pixel.y, gui.escala.x, gui.escala.y).attr({
				fill: "red",
				opacity: "0.3",
				stroke: "red"
			});
		}



	},
	onRefresh: function(){},
	onRefreshCell: function(){},
	refresh: function(){
		var gui = this;


		gui.init();




		var crearSvgObject = function(key){

			var parts = key.split("y");

			parts[0] = parts[0].replace("x", "");


			var pos = {
				x: parseInt(parts[0]),
				y: parseInt(parts[1])
			};

			var pos_pixel = gui.pixelPosByCoord(pos);

			var svgObject = gui.snap.rect(pos_pixel.x, pos_pixel.y, gui.escala.x, gui.escala.y).attr({
				fill: gui.fillCellColor,
				stroke: gui.strokeCellColor
			});


			gui.onRefreshCell(key, svgObject);


			return svgObject;
		};





		gui.fillCellColor = "#FFFFFF";
		for(var idLayer = 0; idLayer < gui.layers.length; idLayer++){
			if(gui.sel.idLayer != idLayer){
				for(key in gui.layers[idLayer].cels){
					gui.layers[idLayer].cels[key].svgObject = crearSvgObject(key);
				}
			}
		}




		gui.fillCellColor = "#000000";
		for(key in gui.layers[gui.sel.idLayer].cels){
			gui.layers[gui.sel.idLayer].cels[key].svgObject = crearSvgObject(key);
		}


		gui.draw.pincel.init(gui);

		if(gui.sel.desde && gui.sel.hasta){
			var desde_pixel = gui.pixelPosByCoord(gui.sel.desde);
			var hasta_pixel = gui.pixelPosByCoord(gui.sel.hasta);


			var box = gui.o.find('#box');

			box.attr({
				x: desde_pixel.x,
				y: desde_pixel.y,
				width: hasta_pixel.x - desde_pixel.x,
				height: hasta_pixel.y - desde_pixel.y
			});
		}


		gui.onRefresh();


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

	setDrawMode: function(drawObj){

		var gui = this;
		gui.draw[drawObj].init(gui);

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
	cellBox: function(desde, hasta, callback){
		var gui = this;

		if(((desde.x == hasta.x) && (desde.y == hasta.y)) || (!hasta)){
			callback(pos);
		}else{
			gui.eachCellBox(desde, hasta, function(pos){
				callback(pos);
			});
		}
	},
	removeCellBox: function(desde, hasta){
		var gui = this;

		if(((desde.x == hasta.x) && (desde.y == hasta.y)) || (!hasta)){
			gui.removeCell(pos);
		}else{
			gui.eachCellBox(desde, hasta, function(pos){
				gui.removeCell(pos);
			});
		}

	},
	addCellBox: function(desde, hasta){
		var gui = this;

		if(((desde.x == hasta.x) && (desde.y == hasta.y)) || (!hasta)){
			gui.addCell(pos);
		}else{
			gui.eachCellBox(desde, hasta, function(pos){
				gui.addCell(pos);
			});
		}
	},
	eachCellBox: function(desde, hasta, callback){
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
	onRemoveCell:function(){
		return;
	},
	removeCell: function(pos){
		var gui = this;

		var key = "x"+pos.x+"y"+pos.y;

		if(typeof(gui.layers[gui.sel.idLayer].cels[key]) == 'undefined'){
			return;
		}

		gui.layers[gui.sel.idLayer].cels[key].svgObject.remove();
		delete gui.layers[gui.sel.idLayer].cels[key];


		gui.onRemoveCell(key);
	},
	onAddCell: function(key){

		return;
	},
	addCell: function(pos, idLayer){
		var gui = this;

		if(typeof(idLayer) == "undefined" ){
			idLayer = gui.sel.idLayer;
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


			if((typeof(gui.layers[gui.sel.idLayer].cels[key]) != 'undefined') || (pos.x == 0 && pos.y == 0)){
				return;
			}
		}


		var pos_pixel = gui.pixelPosByCoord(pos);


		var svgObject = gui.snap.rect(pos_pixel.x, pos_pixel.y, gui.escala.x, gui.escala.y).attr({
			fill: gui.fillCellColor,
			stroke: gui.strokeCellColor
		});


		gui.layers[idLayer].cels[key] = {
			svgObject: svgObject,
			data: {}
		};



		gui.onAddCell(key);

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


	onAddLayer: function(gui, idLayer){
		return;
	},
	addLayer: function(proto){

		this.layers.push($.extend(
			{
				data: null,
				cels: {}
			},proto
		));

		this.selLayer(this.layers.length-1);

		this.onAddLayer(this, this.layers.length-1);

	},
	selLayer: function(idLayer){
		this.sel.idLayer = idLayer;
		this.refresh();
	},
	loadLayers: function(layers){
		var gui = this;

		gui.removeLayers();

		for(var idLayer = 0; idLayer < layers.length; idLayer++){

			gui.addLayer(layers[idLayer]);
		}

		gui.selLayer(gui.layers.length - 1);
	},
	onRemoveLayers: function(){
		return;
	},
	removeLayers: function(){
		var gui = this;

		gui.layers = [];
		gui.onRemoveLayers();
	},
	getLayers: function(){
		var gui = this;
		var _map = [];

		for(var idLayer=0; idLayer < this.layers.length; idLayer++){
			_map.push({
				data: gui.layers[idLayer].data,
				cels: {}
			});

			for(key in gui.layers[idLayer].cels){
				_map[idLayer].cels[key] = {
					data: gui.layers[idLayer].cels[key].data
				};
			}
		}

		return _map;
	},
	setLayer: function(idLayer, mapObject){
		var gui = this;
		gui.layers[0].cels = {};
		Object.keys(mapObject).map(function(key){
			gui.layers[0].cels[key] = {
				data: null
			};
		});
	}

}
