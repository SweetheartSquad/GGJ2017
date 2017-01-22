function Win(scores, beanIdx, ids){
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
    this.scores = scores;

    this.createPodiums(scores);

    this.done = false;
    this.ids = ids;
}   


Win.prototype.createPodiums = function(scores){
    var podiumHeight = 160;
    var graphics = new PIXI.Graphics();
    var width = size.x/6;
    for( var i = 0; i < scores.length; i++ ){
        var playerSprite = new PIXI.Sprite(PIXI.loader.resources["win"].texture);
        var medalSprite = new PIXI.Sprite(PIXI.loader.resources["medal"].texture);
        playerSprite.addChild(medalSprite);
        this.scene.addChild(playerSprite);
        playerSprite.anchor.x = medalSprite.anchor.x = 0.5; 
        //  playerSprite.anchor.y = 0.0;
        var y = size.y - scores[i] * podiumHeight;
        playerSprite.x = i * width + ( size.x / 2 - width * scores.length / 2 ) + width * 0.5;
        playerSprite.y = y - playerSprite.height;
        graphics.beginFill(i % 2 == 0 ? 0xffff00 : 0xff00ff, 1);
        graphics.drawRect(i * width, y, width, scores[i] * podiumHeight);
        graphics.endFill();
        if( i == this.beanIdx ){
            this.beanTargetY = y - playerSprite.height;
            this.bean.x = width * this.beanIdx + (size.x / 2 - width * scores.length / 2) + playerSprite.width/2 - this.bean.width/2;
        }
    }
    graphics.x = size.x / 2 - width * scores.length / 2;
    this.scene.addChild(graphics);
}

Win.prototype.render = function(){
    
}

Win.prototype.update = function(){
     this.bean.y = lerp( this.bean.y, this.beanTargetY, 0.05 );

     if( Math.abs( this.bean.y - this.beanTargetY ) < 10 ){
         for( var i = 0; i < this.scores.length; i++ ){
             var input = getInput(i);
             if( input.dive || input.swap ){
                 this.done = true;
             }
         }
     }
}


Win.prototype.destroy = function(){
    game.removeChild(this.scene);
	this.scene.destroy();
}


Win.prototype.isDone = function(){
    return this.done;
}

Win.prototype.getIds = function(){
    return this.ids;
}