function Win(scores){
	this.scene = new PIXI.Container();
	game.addChild(this.scene);

    // background
	var bg = new PIXI.Graphics();
	bg.beginFill(0x00FFFF);
	bg.drawRect(0,0,size.x,size.y);
	bg.endFill();
	this.scene.addChild(bg);

    this.podiums = [];
    this.createPodiums(scores);
}   


Win.prototype.createPodiums = function(scores){
    
    var graphics = new PIXI.Graphics();
    var width = 250;
    for( var i = 0; i < scores.length; i++ ){
        graphics.beginFill(i % 2 == 0 ? 0xffff00 : 0xff00ff, 1);
        graphics.drawRect(i * width, size.y - scores[i] * 80, width, scores[i] * 80);
        graphics.endFill();
    }
    graphics.x = size.x / 2 - width * scores.length / 2;
    this.scene.addChild(graphics);
}

Win.prototype.render = function(){
    
}

Win.prototype.update = function(){

}

