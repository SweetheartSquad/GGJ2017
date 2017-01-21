function Arena(){

	this.scene = new PIXI.Container();

	game.addChild(this.scene);

	this.scene.x = -size.x/2;
	this.scene.y = -size.y/2;

	game.position.x = size.x/2;
	game.position.y = size.y/2;

}


Arena.prototype.update = function(){

} 


Arena.prototype.render = function(){
	
} 