function Menu(_players){
	this.scene = new PIXI.Container();
	game.addChild(this.scene);

	// background
	var bg = new PIXI.Graphics();
	bg.beginFill(0xFFFFFF);
	bg.drawRect(0,0,size.x,size.y);
	bg.endFill();
	this.scene.addChild(bg);


	// create graphics
	this.playerGraphics=[];
	for(var i = 1; i <= 4; ++i){
		var ready = new PIXI.Sprite(PIXI.loader.resources["joined_" + i].texture);
		this.scene.addChild(ready);
		ready.anchor.x = 0.5;
		ready.anchor.y = 0.5;
		ready.visible = false;

		var joined = new PIXI.Sprite(PIXI.loader.resources["ready_" + i].texture);
		this.scene.addChild(joined);
		joined.anchor.x = 0.5;
		joined.anchor.y = 0.5;
		joined.visible = false;

		var readyText = new PIXI.Sprite(PIXI.loader.resources.readyText.texture);
		this.scene.addChild(readyText);
		readyText.anchor.x = 0.5;
		readyText.anchor.y = 0.5;
		readyText.visible = false;

		var joinText = new PIXI.Sprite(PIXI.loader.resources.joinText.texture);
		this.scene.addChild(joinText);
		joinText.anchor.x = 0.5;
		joinText.anchor.y = 0.5;
		joinText.visible = false;

		this.playerGraphics.push(
			{
				ready: ready,
				joined: joined,
				readyText: readyText,
				joinText: joinText
			}
		);
	}

	// position graphics
	for(var i = 0; i < 4; ++i){
		this.playerGraphics[i].ready.x = this.playerGraphics[i].joined.x = this.playerGraphics[i].readyText.x = this.playerGraphics[i].joinText.x = size.x * 0.25 * (i+0.5);
		this.playerGraphics[i].ready.y = this.playerGraphics[i].joined.y = this.playerGraphics[i].readyText.y = this.playerGraphics[i].joinText.y = size.y * 0.75;
	}

	// logo
	this.logo = new PIXI.Sprite(PIXI.loader.resources["BEAN-logo"].texture);
	this.logo.anchor.x = 0.5;
	this.logo.anchor.y = 0.5;
	this.logo.position.x = size.x/2;
	this.logo.position.y = size.y/2;
	this.scene.addChild(this.logo);


	this.joined = [false,false,false,false];
	this.ready = [false,false,false,false];

	// automatically join passed in players
	if(_players){
		for(var i = 0; i < _players.length; ++i){
			this.joined[_players[i]] = true;
		}
	}
};

Menu.prototype.destroy = function(){
	game.removeChild(this.scene);
	this.scene.destroy();
};

Menu.prototype.update = function(){
	if(!this.isDone()){
		for(var i = 0; i < 4; ++i){
			var input = getInput(i);

			if(input.dive){
				if(this.ready[i]){
					// nothing
				}else if(this.joined[i]){
					// ready up
					this.ready[i] = true;
					//sounds[""].play();
				}else{
					// join
					this.joined[i] = true;
					//sounds[""].play();
				}
			}

			if(input.swap){
				if(this.ready[i]){
					// unready
					this.ready[i] = false;
					//sounds["cancel"].play();
				}else if(this.joined[i]){
					// unjoin
					this.joined[i] = false;
					//sounds["cancel"].play();
				}else{
					// nothing
				}
			}


			if(this.ready[i]){
				// ready
				this.playerGraphics[i].joinText.visible = false;
				this.playerGraphics[i].readyText.visible = false;
				this.playerGraphics[i].ready.visible = true;
				this.playerGraphics[i].joined.visible = false;
			}else if(this.joined[i]){
				// joined but not ready
				this.playerGraphics[i].joinText.visible = false;
				this.playerGraphics[i].readyText.visible = true;
				this.playerGraphics[i].ready.visible = false;
				this.playerGraphics[i].joined.visible = true;
			}else{
				// not even joined yet
				this.playerGraphics[i].joinText.visible = true;
				this.playerGraphics[i].readyText.visible = false;
				this.playerGraphics[i].ready.visible = false;
				this.playerGraphics[i].joined.visible = false;
			}
		}
	}
};

Menu.prototype.isDone = function(){
	var numjoined = 0;
	var numready = 0;
	for(var i = 0; i < 4; ++i){
		if(this.joined[i]){
			numjoined += 1;
		}if(this.ready[i]){
			numready += 1;
		}
	}
	return numjoined > 1 && numjoined == numready;
};

Menu.prototype.getPlayers = function(){
	var players = [];
	for(var i = 0; i < 4; ++i){
		if(this.ready[i]){
			players.push(i);
		}
	}
	return players;
};

Menu.prototype.render = function(){

};