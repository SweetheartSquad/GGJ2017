function Arena(){
	this.players = [];
	this.lanes = [];
	this.scene = new PIXI.Container();

	game.addChild(this.scene);

	var bg = new PIXI.Sprite( PIXI.loader.resources.arena.texture );
	bg.width = size.x;
	bg.height = size.y;
	this.scene.addChild(bg);

	this.addPlayers();
	this.addLanes();

	var g = new PIXI.Graphics();
	g.beginFill(0,0);
	g.lineStyle(3,0xFF0000);
	g.drawRect(poolBounds.x, poolBounds.y, poolBounds.width, poolBounds.height);
	g.endFill();

	this.scene.addChild(g);
}


Arena.prototype.update = function(){
	for( var i = 0; i < this.players.length; i++ ){
		this.players[i].update();
	}
	this.updateLanes();
} 


Arena.prototype.render = function(){
	
}

Arena.prototype.addPlayers = function(){
	for( var i = 0; i < 4; i++ ){
		var player = new Player( i );
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
			lane.points.push(new PIXI.Point(poolBounds.x + x/(segments-1)*poolBounds.width, 0));
			lane.points[x].rootY = poolBounds.y + y/4*poolBounds.height;
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
			lane.points[p].y = lane.points[p].rootY + (Math.sin(i + p/2 + curTime/111)*3 + Math.sin(i/3 + p/4 + curTime/222)*3 + Math.sin(i/5 + p/6 + curTime/333)*3) * (1 - (Math.abs(p - lane.points.length/2))/(lane.points.length/2));
		}
	}
}