function Win(scores, beanIdx, ids){
	this.scene = new PIXI.Container();
	game.addChild(this.scene);

    this.flashyFont = new PIXI.TextStyle({
        fontFamily: "serif",
        fontSize: size.x/20+"px",
        align: "center",
        fill: 0x666,
        stroke: 0xfff,
        strokeThickness: 5
    });

    this.beanIdx = beanIdx;
    // background
	var bg = new PIXI.Graphics();
	bg.beginFill(0x00FFFF);
	bg.drawRect(0,0,size.x,size.y);
	bg.endFill();
	this.scene.addChild(bg);

    this.bean = new PIXI.Sprite(PIXI.loader.resources.bean.texture);
    var beanText = new PIXI.Text("LOSER",this.flashyFont);
	this.bean.addChild(beanText);
    beanText.anchor.x = beanText.anchor.y = 0.5;
    this.bean.anchor.x = this.bean.anchor.y = 0.5;
	//this.bean.anchor.y = 0.5;
	this.bean.y = -size.y*2;
    this.scores = scores;

    this.scores=[];
    for(var i = 0; i < scores.length; ++i){
        this.scores.push({
            place: null,
            score: scores[i],
            id: i
        });
    }

    var place = 1;
    while(place <= scores.length){
        var max=-1;
        var maxIdx=-1;
        for(var i = 0; i < this.scores.length; ++i){
            if(this.scores[i].place){
                continue;
            }
            if(this.scores[i].score > max){
                max = this.scores[i].score;
                maxIdx = i;
            }
        }
        this.scores[maxIdx].place = place;
        place += 1;
    }


    this.createPodiums();
    this.scene.addChild(this.bean);

    this.done = false;
    this.ids = ids;

    this.beanTimer = 120;
}   


Win.prototype.createPodiums = function(){
    var scores = this.scores;

    var podiumHeight = 160;
    var graphics = new PIXI.Graphics();
    this.scene.addChild(graphics);
    var width = size.x/6;
    for( var i = 0; i < scores.length; i++ ){
        var playerSprite = new PIXI.Sprite(PIXI.loader.resources["win"].texture);
        var medalSprite = new PIXI.Sprite(PIXI.loader.resources["medal"].texture);
        var playerText = new PIXI.Text((scores[i].id+1).toString(10), {
            fontFamily: "Times New Roman",
            fontSize: "32px",
            fill:0xFFFF00,
            align: "center"
        });
        var medalText = new PIXI.Text(scores[i].place,this.flashyFont);
        medalSprite.addChild(medalText);
        playerSprite.addChild(medalSprite);
        playerSprite.addChild(playerText);
        this.scene.addChild(playerSprite);
        playerText.anchor.x = playerText.anchor.y = medalText.anchor.x = medalText.anchor.y = 0.5;
        playerText.y = playerSprite.height*0.11;
        playerText.x = playerSprite.width*0.01;
        medalText.y = medalSprite.height*0.53;
        playerSprite.anchor.x = medalSprite.anchor.x = 0.5; 


        //  playerSprite.anchor.y = 0.0;
        var y = size.y - scores[i].score * podiumHeight;
        playerSprite.x = i * width + ( size.x / 2 - width * scores.length / 2 ) + width * 0.5;
        playerSprite.y = y - playerSprite.height*0.975;
        graphics.beginFill(i % 2 == 0 ? 0xffff00 : 0xff00ff, 1);
        graphics.drawRect(i * width, y, width, scores[i].score * podiumHeight);
        graphics.endFill();
        if( i == this.beanIdx ){
            this.beanTargetY = y - playerSprite.height*0.45;
            this.bean.x = playerSprite.x;
        }
    }
    graphics.x = size.x / 2 - width * scores.length / 2;
}

Win.prototype.render = function(){
    
}

Win.prototype.update = function(){
    if(this.beanTimer > 0){
        this.beanTimer -=1;
    }else{
        this.bean.y = lerp( this.bean.y, this.beanTargetY, 0.05 );
    }
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