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

} 


Arena.prototype.render = function(){
	
}

Arena.prototype.addPlayers = function(){
	for( var i = 1; i < 5; i++ ){
		var player = new Player( i );
		player.container.x = 150;
		this.players.push( player );
		this.scene.addChild( player.container );
	}
}
