
this.poolBounds = {
		width: 1700,
		height: 900,
		x : 200,
		y : 200
}

function Arena(){
	this.players = [];
	this.scene = new PIXI.Container();

	game.addChild(this.scene);

	var bg = new PIXI.Sprite( PIXI.loader.resources.arena.texture );
	bg.width = size.x;
	bg.height = size.y;
	this.scene.addChild(bg);
	
	this.addPlayers();
}


Arena.prototype.update = function(){
	for( var i = 0; i < this.players.length; i++ ){
		this.players[i].update();
	}
} 


Arena.prototype.render = function(){
	
}

Arena.prototype.addPlayers = function(){
	for( var i = 1; i < 5; i++ ){
		var player = new Player( i );
		this.players.push( player );
		this.scene.addChild( player.container );
	}
}
