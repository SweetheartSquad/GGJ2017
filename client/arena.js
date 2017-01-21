

function Arena(){
	this.players = [];
	this.lanes = [];
	this.scene = new PIXI.Container();

	game.addChild(this.scene);

	this.poolBounds = {
		width: size.x - size.x/14*2,
		height: size.y - size.y/4,
		x : size.x/14,
		y : size.y/6
	}

	var bg = new PIXI.Sprite( PIXI.loader.resources.arena.texture );
	bg.width = size.x;
	bg.height = size.y;
	this.scene.addChild(bg);

	this.addPlayers();
	this.addLanes();

	var g = new PIXI.Graphics();
	g.beginFill(0,0);
	g.lineStyle(3,0xFF0000);
	g.drawRect(this.poolBounds.x, this.poolBounds.y, this.poolBounds.width, this.poolBounds.height);
	g.endFill();

	this.scene.addChild(g);
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
			lane.points.push(new PIXI.Point(this.poolBounds.x + x/(segments-1)*this.poolBounds.width, 0));
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
			lane.points[p].y = this.poolBounds.y + (i+0.5)/4*this.poolBounds.height + Math.sin(i + p/2 + curTime/111)*3 + Math.sin(i/3 + p/4 + curTime/222)*3 + Math.sin(i/5 + p/6 + curTime/333)*3;
		}
	}
}