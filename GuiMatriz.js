$(function(){
  $('body').append(`
		<style>

			.guiMatrix{

			}
			.guiMatrix>.toolbar{
				position: absolute;
				left: 0px;
				top: 0px;
				width: 100%;
				height: 24px;
			}
			.guiMatrix>.cels{
				position: absolute;
				left: 0px;
				top: 0px;
				width: 100%;
				height: 100%;
				overflow: scroll;
			}
			.guiMatrix>.cels>svg{
				position: absolute;
				left: 0px;
				top: 0px;
			}
			.guiMatrix>.layers{
				position: absolute;
				left: 0px;
				top: 24px;
				width: 84px;
			}

			.guiMatrix>.layers>.layer>.idLayer{
				float: left;
				width: 20px;
				height: 20px;
				left: 0px;
				border: solid 1px;
				cursor: pointer;
				user-select: none;

				text-align: center;
				font-family: "Arial Black", Gadget, sans-serif;
				background-color: #FFFFFF;
			}

			.guiMatrix>.layers>.layer>.data{
				float: right;
				top: 0px;
				width: 60px;
				height: 20px;

				border: solid 1px;
				display: table-cell;
			}


			.guiMatrix>.layers>.layer>.data>input{
				width: 100%;
			}
		</style>
	`);
});

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
	addCell: function(pos, runCallback, idLayer){
		var gui = this;

		if(typeof(idLayer) == "undefined" ){
			idLayer = gui.sel.idLayer;
		};

		if(typeof(runCallback) == "undefined" ){
			runCallback = true
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


		if(runCallback){
			gui.onAddCell(key);
		}

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
