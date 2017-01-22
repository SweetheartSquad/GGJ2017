function Arena(_players){
	this.players = [];
	this.lanes = [];
	this.laneCounts = [];
	this.scene = new PIXI.Container();

	game.addChild(this.scene);

	var bg = new PIXI.Graphics();
	bg.beginFill(0x00FFFF);
	bg.drawRect(0,0,size.x,size.y);
	bg.endFill();
	this.scene.addChild(bg);

	this.addPlayers(_players);
	this.addLanes();

	var arena = new PIXI.Sprite( PIXI.loader.resources.arena.texture );
	arena.width = size.x;
	arena.height = size.y;
	this.scene.addChild(arena);

	if(debug){
		var g = new PIXI.Graphics();
		g.beginFill(0,0);
		g.lineStyle(3,0xFF0000);
		g.drawRect(poolBounds.x, poolBounds.y, poolBounds.width, poolBounds.height);
		g.endFill();
		this.scene.addChild(g);
	}
	
	this.addLaneCounts();
}


Arena.prototype.update = function(){
	for( var i = 0; i < this.players.length; i++ ){
		this.players[i].update();
	}

	for( var i = 0; i < this.players.length; i++ ){
		this.players[i].notifyPositions(this.players);
		for( var j = i+1; j < this.players.length; j++ ){
			// if
			// players next to each other
			// and
			// their relative positions changed
			if(
				Math.abs(this.players[i].lane - this.players[j].lane) == 1 
				&&
				((
					this.players[i].lastX < this.players[j].lastX &&
					this.players[i].container.x > this.players[j].container.x 
				)
				||
				(
					this.players[i].lastX > this.players[j].lastX &&
					this.players[i].container.x < this.players[j].container.x
				))
			){
				this.players[i].pass(this.players[j]);
				var canPass = this.players[j].pass(this.players[i]);
				console.log(canPass);
				if( canPass ){
					this.handlePass( this.players[i], this.players[j] );
				}
			}
		}
	}


	this.updateLanes();
	this.updateLaneCounts();
};


Arena.prototype.render = function(){
	
};

Arena.prototype.isDone = function(){
	for( var i = 0; i < this.players.length; i++ ){
		if(this.players[i].lapsRemaining <= 0){
			return true;
		}
	}
	return false;
}


Arena.prototype.handlePass = function(pA, pB){
	if(pA.willDive == pB.willDive){
		if( pA.willSwap ){
			this.swap( pA, pB );	
		}
		if( pB.willSwap ){
			this.swap( pA, pB );
		}
	}
	sounds["pass"].play();
	transition += 0.2;
	pA.executeQueued();
	pB.executeQueued();
};

Arena.prototype.swap = function( pA, pB ){
	console.log("swap");
	
	// swap lanes
	var la = pA.lane;
	pA.lane = pB.lane;
	pB.lane = la;

	pA.visualSwapQueue.push({
		lane: pA.lane,
		time: 10
	});
	pB.visualSwapQueue.push({
		lane: pB.lane,
		time: 10
	});

	// if a player has the bean, also swap that
	if( pA.hasBean ){
		pB.hasBean = true;
		pA.hasBean = false;
	}else if( pB.hasBean ){
		pA.hasBean = true;
		pB.hasBean = false;
	}
};

Arena.prototype.addPlayers = function(_players){
	for( var i = 0; i < _players.length; i++ ){
		var player = new Player( _players[i], i );
		this.players.push( player );
		this.scene.addChild( player.container );
	}
};


Arena.prototype.addLanes = function(){
	var segments = 40;
	for(var y = 1; y < 4; ++y){
		var lane = {
			container: new PIXI.Container(),
			mesh: null,
			points: []
		};
		lane.container.y = (poolBounds.y + y/4*poolBounds.height);
		for (var x = 0; x < segments; ++x){
			lane.points.push(new PIXI.Point(poolBounds.x + x/(segments-1)*poolBounds.width, 0));
		}
		lane.mesh = new PIXI.mesh.Rope(PIXI.loader.resources.lane.texture, lane.points);
		lane.mesh.height = size.y/15;
		lane.container.addChild(lane.mesh);
		this.scene.addChild( lane.container );
		this.lanes.push(lane);
	}
};

Arena.prototype.addLaneCounts = function(){
	var font = new PIXI.TextStyle({
		fontFamily: "serif",
		fontSize: size.x/16+"px",
		align: "center",
		fill: 0x666,
		stroke: 0xfff,
		strokeThickness: 5
	});
	for(var i = 0; i < this.players.length; ++i){
		var laneCount = {
			player: this.players[i],
			texts: [
				new PIXI.Text("99", font),
				new PIXI.Text("99", font)
			]
		};

		laneCount.texts[0].x = poolBounds.x - 80;
		laneCount.texts[1].x = poolBounds.x+poolBounds.width + 90;

		laneCount.texts[0].x = poolBounds.x - 80;
		laneCount.texts[1].x = poolBounds.x+poolBounds.width + 90;
		laneCount.texts[0].anchor.x = 0.5;
		laneCount.texts[1].anchor.x = 0.5;
		laneCount.texts[0].anchor.y = 0.5;
		laneCount.texts[1].anchor.y = 0.5;
		this.scene.addChild( laneCount.texts[0] );
		this.scene.addChild( laneCount.texts[1] );
		this.laneCounts.push(laneCount);
	}
};



Arena.prototype.updateLanes = function(){
	// wavy lanes
	for(var i = 0; i < this.lanes.length; ++i){
		var lane = this.lanes[i];
		for(var p = 0; p < lane.points.length; ++p){
			lane.points[p].y = (Math.sin(i + p/2 + curTime/111)*3 + Math.sin(i/3 + p/4 + curTime/222)*3 + Math.sin(i/5 + p/6 + curTime/333)*3) * (1 - (Math.abs(p - lane.points.length/2))/(lane.points.length/2));
		}
	}
};

Arena.prototype.destroy = function(){
	game.removeChild(this.scene);
	this.scene.destroy();
};

Arena.prototype.getScores = function(){
	var scores = [];
	for( var i = 0; i < this.players.length; i++ ){
		scores.push( 1 - this.players[i].lapsRemaining/NUM_LAPS );
	}
	return scores;
}

Arena.prototype.getIds = function(){
	var ids = [];
	for( var i = 0; i < this.players.length; i++ ){
		ids.push( this.players[i].id );
	}
	return ids;
}


Arena.prototype.getBeaned = function(){
	for( var i = 0; i < this.players.length; i++ ){
		if( this.players[i].hasBean ){
			return i;
		}
	}
}

Arena.prototype.bean = function(id){
	for( var i = 0; i < this.players.length; i++ ){
		if( this.players[i].id == id ){
			this.players[i].hasBean = true;
			return;
		}
	}
}


Arena.prototype.updateLaneCounts = function(){
	// wavy lanes
	for(var i = 0; i < this.laneCounts.length; ++i){
		var laneCount = this.laneCounts[i];
		for(var j = 0; j < laneCount.texts.length; ++j){
			var text = laneCount.texts[j];
			
			text.scale.x = lerp(text.scale.x, 1, 0.1);
			text.scale.y = text.scale.x;
			text.y = poolBounds.y + laneSize * (laneCount.player.lane + 0.5);
			
			var t = text.text;
			text.setText(laneCount.player.lapsRemaining);
			if(t != text.text){
				text.scale.x += 1;
				text.scale.y += 1;
				sounds["lap"].play();
				shaderAmount += 0.5;
			}

		}
	}
};