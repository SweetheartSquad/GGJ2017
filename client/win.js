function Win(scores, beanIdx){
	this.scene = new PIXI.Container();
	game.addChild(this.scene);

    this.beanIdx = beanIdx;
    // background
	var bg = new PIXI.Graphics();
	bg.beginFill(0x00FFFF);
	bg.drawRect(0,0,size.x,size.y);
	bg.endFill();
	this.scene.addChild(bg);

    this.bean = new PIXI.Sprite(PIXI.loader.resources.bean.texture);
	this.bean.anchor.x = 0.5;
	//this.bean.anchor.y = 0.5;
	this.bean.y = -size.y;
	this.scene.addChild(this.bean);

    this.createPodiums(scores);

}   


Win.prototype.createPodiums = function(scores){
    var podiumHeight = 160;
    var graphics = new PIXI.Graphics();
    var width = size.x/6;
    for( var i = 0; i < scores.length; i++ ){
        var char = new PIXI.Sprite(PIXI.loader.resources["win"].texture);
        this.scene.addChild(char);
        char.anchor.x = 0.5; 
        //  char.anchor.y = 0.0;
        var y = size.y - scores[i] * podiumHeight;
        char.x = i * width + ( size.x / 2 - width * scores.length / 2 ) + width * 0.5;
        char.y = y - char.height;
        graphics.beginFill(i % 2 == 0 ? 0xffff00 : 0xff00ff, 1);
        graphics.drawRect(i * width, y, width, scores[i] * podiumHeight);
        graphics.endFill();
        if( i == this.beanIdx ){
            this.beanTargetY = y - char.height;
            this.bean.x = width * this.beanIdx + (size.x / 2 - width * scores.length / 2) + char.width/2 - this.bean.width/2;
        }
    }
    graphics.x = size.x / 2 - width * scores.length / 2;
    this.scene.addChild(graphics);
}

Win.prototype.render = function(){
    
}

Win.prototype.update = function(){
     this.bean.y = lerp( this.bean.y, this.beanTargetY, 0.05 );
}

