

function Arena(){
	this.players = [];
	this.scene = new PIXI.Container();

	game.addChild(this.scene);
	
	this.poolBounds = {
		x: size.x * 0.85,
		y: size.y * 0.85
	}

	this.addPlayers();
}


Arena.prototype.update = function(){

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
