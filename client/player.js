

DEFAULT_SPEED = 2;
SPEED_RESET_FRAMES = 60;
NUM_LAPS = 3;

function Player( _id, _lane ){
	this.dive_filter = new CustomFilter(PIXI.loader.resources.dive_shader.data);
	this.dive_filter.uniforms.dive = 0;

    this.actualWidth = size.x/5;
    this.id = _id;
    this.lane = _lane;
    this.lapsRemaining = NUM_LAPS;

    this.container = new PIXI.Container();
    this.container.y = poolBounds.y + laneSize * (this.lane + 0.5);
    this.container.filters = [this.dive_filter];

    // animation frames
    this.swimmerframes=[];
    this.beanframes=[];
    for(var i = 1; i <= 9; ++i){
    	this.swimmerframes.push(PIXI.loader.resources["swimmer_"+i.toString(10)].texture);
    	this.beanframes.push(PIXI.loader.resources["swimmerbean_"+i.toString(10)].texture);
    }
	this.swimmerframes.push(PIXI.loader.resources["swimmer_1"].texture);
	this.beanframes.push(PIXI.loader.resources["swimmerbean_1"].texture);

	// swimmer
    this.swimmerSprite = new PIXI.extras.AnimatedSprite( this.swimmerframes );
    this.swimmerSprite.loop = false;
    this.swimmerSprite.anchor.x = 0.5;
    this.swimmerSprite.anchor.y = 0.5;
    this.swimmerSprite.width = this.actualWidth;
    this.swimmerSprite.scale.y = this.swimmerSprite.scale.x;
    this.container.addChild( this.swimmerSprite );

    // bean
    this.beanSprite = new PIXI.extras.AnimatedSprite( this.beanframes );
    this.beanSprite.loop = false;
    this.beanSprite.anchor.x = 0.5;
    this.beanSprite.anchor.y = 0.5;
    this.beanSprite.width = this.actualWidth;
    this.beanSprite.scale.y = this.beanSprite.scale.x;
    this.container.addChild( this.beanSprite );

    // number
    this.numberText = new PIXI.Text((_id+1).toString(10), {
    	fontFamily: "Times New Roman",
    	fontSize: "32px",
    	fill:0xFFFF00
    });
    this.numberText.anchor.x = 0.5;
    this.numberText.anchor.y = 0.5;
    this.container.addChild(this.numberText);
    this.numberText.rotate = Math.PI/2;
    this.numberText.x = this.actualWidth*0.22;

    //this.swimmerSprite.tint = this.beanSprite.tint = Math.random()*0xFFFFFF;

    this.nextStroke = 0;
    this.framesSinceCorrectStroke = 0;
    
    this.willDive = false;
    this.willSwap = false;
    this.canQueue = false;

    this.hasBean = false;

    this.canPass = {};

    this.queueTimeout = 0;

    if(debug){
	    var debug = new PIXI.Graphics();
	    debug.beginFill(0,0);
	    debug.lineStyle(1,0xFF0000);
	    debug.drawCircle(0,0,this.swimmerSprite.width/3);
	    debug.endFill();
	    this.container.addChild(debug);
    }

    this.container.x = poolBounds.x + this.swimmerSprite.width * 0.5;

    this.speed = DEFAULT_SPEED;
    this.direction = 1;

    this.visualSwapQueue = [];
}



Player.prototype.update = function(){
    this.beanSprite.visible = this.hasBean;
    this.swimmerSprite.visible = !this.hasBean;

    var laneSize = poolBounds.height * 0.25;
    this.lastX = this.container.x;

    var input = getInput( this.id );

    if( this.queueTimeout <= 0 ){
        this.willDive = false;
        this.willSwap = false;
    } 


    if( input.dive == true ){
        this.willDive = true;
        this.queueTimeout = 60;
    }

    
    if( input.swap == true ){
        this.willSwap = true;
        this.queueTimeout = 60;
    }

    this.queueTimeout--;

    this.framesSinceCorrectStroke++;

    if(input.strokeLeft || input.strokeRight){
    	this.swimmerSprite.gotoAndPlay(0);
    	this.beanSprite.gotoAndPlay(0);
    }

    if( (this.nextStroke === 0 || this.nextStroke === -1) && input.strokeLeft ){
        this.nextStroke = 1;
        this.correctStroke();
    }
    
    if( (this.nextStroke === 0 || this.nextStroke === 1) && input.strokeRight ){
        this.nextStroke = -1;
        this.correctStroke();
    }

    if( this.nextStroke === 1 && input.strokeLeft ){
        this.speed -= 1;
    }

    
    if( this.nextStroke === -1 && input.strokeRight ){
        this.speed -= 1;
    }

    if ( this.framesSinceCorrectStroke >= SPEED_RESET_FRAMES ) {
        this.framesSinceCorrectStroke = 0;
        this.nextStroke = 0;
    }

    this.speed = lerp( this.speed, DEFAULT_SPEED, 0.025 );
    
    if( this.speed > 0 ){
        this.container.x += this.speed * this.direction * (size.x/1920);
    }

    if(
    	( this.container.x + this.swimmerSprite.width/2 >= poolBounds.width + poolBounds.x )
    	||
        ( this.container.x - this.swimmerSprite.width/2 <= poolBounds.x )
    ){
        this.direction = -this.direction;
        this.lapsRemaining -= 1;
        this.container.scale.x *= -1;
        this.numberText.scale.x *= -1;
    }
    
    if(this.visualSwapQueue.length > 0){
    	this.visualSwapQueue[0].time -= 1;
    	if(this.visualSwapQueue[0].time <= 0){
    		this.visualSwapQueue.shift();
    		if(this.hasBean){
    			sounds["bean"].play();
    		}else{
    			sounds["swap"].play();
    		}
    	}
    }

    var l = this.visualSwapQueue.length > 0 ? this.visualSwapQueue[0].lane : this.lane;
    this.container.y = lerp(this.container.y, poolBounds.y + laneSize * (l + 0.5), 0.25);


    this.beanSprite.animationSpeed = this.speed/DEFAULT_SPEED/3;
    this.swimmerSprite.animationSpeed = this.speed/DEFAULT_SPEED/3;

    var scale = lerp(Math.abs(this.container.scale.x), this.willDive ? 0.75 : 1, 0.1);
    this.container.scale.x = Math.sign(this.container.scale.x) * scale;
    this.container.scale.y = Math.sign(this.container.scale.y) * scale;
    this.dive_filter.uniforms.dive = lerp(this.dive_filter.uniforms.dive, this.willDive ? 1 : 0, 0.1);
}


Player.prototype.executeQueued = function(){
    if( this.willSwap === true ){
        this.swap();
    }
    if( this.willDive === true ){
        this.dive();
    }
    this.queueTimeout = 0;
}

Player.prototype.correctStroke = function(){
    this.speed += 2;
    this.framesSinceCorrectStroke = 0;
    this.container.scale.y *= -1;
    this.numberText.scale.y *= -1;
}


Player.prototype.pass = function( player ){
    var key = String(player.id);
    if( !this.canPass.hasOwnProperty(key) 
        || this.canPass[key] === true ){
       console.log(this.id,"passing", player.id);
       this.canPass[key] = false;
       return true;
    }
    return false;
}


Player.prototype.notifyPositions = function( players ){
    for ( var i = 0; i < players.length; i++ ){
        var key = String(players[i].id);
        if ( !this.canPass.hasOwnProperty(key) 
            || ( !this.canPass[key] && Math.abs( players[i].container.x - this. container.x ) > 100 )){
            this.canPass[key] = true;
        }
    }
}


Player.prototype.dive = function(){
    this.willDive = false;
}


Player.prototype.swap = function(){
    this.willSwap = false;
}


Player.prototype.draw = function(){

}   