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
		var lobby = new PIXI.Sprite(PIXI.loader.resources.lobby.texture);
		this.scene.addChild(lobby);
		lobby.anchor.x = 0.5;

		var ready = new PIXI.Sprite(PIXI.loader.resources["ready_" + i].texture);
		this.scene.addChild(ready);
		ready.anchor.x = 0.5;
		ready.visible = false;

		var joined = new PIXI.Sprite(PIXI.loader.resources["joined_" + i].texture);
		this.scene.addChild(joined);
		joined.anchor.x = 0.5;
		joined.visible = false;

		var readyText = new PIXI.Sprite(PIXI.loader.resources.readyText.texture);
		this.scene.addChild(readyText);
		readyText.anchor.x = 0.5;
		readyText.visible = false;

		var joinText = new PIXI.Sprite(PIXI.loader.resources.joinText.texture);
		this.scene.addChild(joinText);
		joinText.anchor.x = 0.5;
		joinText.visible = false;

		this.playerGraphics.push(
			{
				lobby: lobby,
				ready: ready,
				joined: joined,
				readyText: readyText,
				joinText: joinText
			}
		);
	}

	// position graphics
	for(var i = 0; i < 4; ++i){
		this.playerGraphics[i].lobby.x = this.playerGraphics[i].ready.x = this.playerGraphics[i].joined.x = this.playerGraphics[i].readyText.x = this.playerGraphics[i].joinText.x = size.x * 0.25 * (i+0.5);
		this.playerGraphics[i].lobby.y = this.playerGraphics[i].ready.y = this.playerGraphics[i].joined.y = this.playerGraphics[i].readyText.y = this.playerGraphics[i].joinText.y = 0;

		this.playerGraphics[i].lobby.width = this.playerGraphics[i].ready.width = this.playerGraphics[i].joined.width = this.playerGraphics[i].readyText.width = this.playerGraphics[i].joinText.width = size.x * 0.25;
		this.playerGraphics[i].lobby.height = this.playerGraphics[i].ready.height = this.playerGraphics[i].joined.height = this.playerGraphics[i].readyText.height = this.playerGraphics[i].joinText.height = size.y;
	}

	// logo
	this.logo = new PIXI.Sprite(PIXI.loader.resources["BEAN-logo"].texture);
	this.logo.anchor.x = 0.5;
	this.logo.anchor.y = 0.5;
	this.logo.position.x = size.x/2;
	this.logo.position.y = size.y/3;
	this.logo.width = size.x*0.7;
	this.logo.scale.y = this.logo.scale.x;
	this.scene.addChild(this.logo);

	this.bean = new PIXI.Sprite(PIXI.loader.resources.bean.texture);
	this.bean.anchor.x = 0.5;
	this.bean.anchor.y = 0.5;
	this.bean.y = -size.y;
	this.scene.addChild(this.bean);


	this.joined = [false,false,false,false];
	this.ready = [false,false,false,false];

	// automatically join passed in players
	if(_players){
		for(var i = 0; i < _players.length; ++i){
			this.joined[_players[i]] = true;
		}
	}

	this.beanTimer = 0;
	this.whoIsBeaned = -1;
};

Menu.prototype.destroy = function(){
	game.removeChild(this.scene);
	this.scene.destroy();
};

Menu.prototype.lobbyUpdate = function(){
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

Menu.prototype.beanUpdate = function(){
	for(var i = 0; i < 4; ++i){
		this.playerGraphics[i].joinText.visible = false;
		this.playerGraphics[i].readyText.visible = false;
	}

	if(this.whoIsBeaned < 0){
		var p = this.getPlayers();

		this.whoIsBeaned = p[Math.floor(Math.random()*p.length)];
		this.bean.x = (this.whoIsBeaned+0.5)/4 * size.x;
	}
	this.beanTimer += 1;
	this.logo.y = lerp(this.logo.y, -size.y, ease(this.beanTimer/100));
	this.bean.y = lerp(this.bean.y, size.y*0.75, ease(this.beanTimer/100));
};

Menu.prototype.isBeaned = function(){
	return this.beanTimer > 50;
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