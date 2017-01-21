

function Arena(){
	this.players = [];
	this.lanes = [];
	this.scene = new PIXI.Container();

	game.addChild(this.scene);
	
	this.poolBounds = {
		width: 1700,
		height: 900,
		x : 200,
		y : 200
	}

	var bg = new PIXI.Sprite( PIXI.loader.resources.arena.texture );
	bg.width = size.x;
	bg.height = size.y;
	this.scene.addChild(bg);

	this.addPlayers();
	this.addLanes();
}


Arena.prototype.update = function(){
	this.updateLanes();
} 


Arena.prototype.render = function(){
	
}

Arena.prototype.addPlayers = function(){
	for( var i = 1; i < 5; i++ ){
		var player = new Player( i, this.poolBounds );
		this.players.push( player );
		this.scene.addChild( player.container );
	}
}


Arena.prototype.addLanes = function(){
	var segments = 10;
	for(var y = 1; y < 4; ++y){
		var lane = {
			mesh: null,
			points: []
		};
		for (var x = 0; x < segments; ++x){
			lane.points.push(new PIXI.Point(x/(segments-1)*size.x,(y+0.5)/4*size.y));
		}
		lane.mesh = new PIXI.mesh.Rope(PIXI.loader.resources.lane.texture, lane.points);
		this.scene.addChild( lane.mesh );
		this.lanes.push(lane);
	}
}



Arena.prototype.updateLanes = function(){
	// wavy lanes
	for(var i = 0; i < this.lanes.length; ++i){
		var lane = this.lanes[i];
		for(var p = 0; p < lane.points.length; ++p){
			lane.points[p].y = (i+0.5)/3*size.y + Math.sin(i + p/2 + curTime/111)*3 + Math.sin(i/3 + p/4 + curTime/222)*3 + Math.sin(i/5 + p/6 + curTime/333)*3;
		}
	}
}