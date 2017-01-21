function Arena(){

	this.scene = new PIXI.Container();

	game.addChild(this.scene);

	var bg = new PIXI.Sprite( PIXI.loader.resources.arena.texture );
	bg.width = size.x;
	bg.height = size.y;
	this.scene.addChild(bg);

	var player = new Player();
	this.scene.addChild( player.container );

	player.container.x = 500;
	player.container.y = 500;
}


Arena.prototype.update = function(){

} 


Arena.prototype.render = function(){
	
}
