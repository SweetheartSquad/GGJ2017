var startTime = 0;
var lastTime = 0;
var curTime = 0;

var game;
try{
	game = new PIXI.Container();
}catch(e){
	document.body.innerHTML="<p>Unsupported Browser. Sorry :(</p>";
}
var resizeTimeout=null;

var size={x:1920,y:1080};

var sounds=[];

var scaleMode = 1;
var scaleMultiplier = 1;

$(document).ready(function(){

	// try to auto-focus and make sure the game can be focused with a click if run from an iframe
	window.focus();
	$(document).on("mousedown",function(event){
		window.focus();
	});

	// setup game
	startTime=Date.now();


	// create renderer
	renderer = new PIXI.WebGLRenderer(size.x, size.y, {
		antiAlias:false,
		transparent:false,
		resolution:1,
		roundPixels:true,
		clearBeforeRender:true,
		autoResize:false,
	});
	
	renderer.backgroundColor = 0x1099bb;

	PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
	PIXI.WRAP_MODES.DEFAULT = PIXI.WRAP_MODES.MIRRORED_REPEAT;

	// add the canvas to the html document
	$("#display").prepend(renderer.view);


	sounds["bgm"]=new Howl({
		urls:["assets/audio/DIRTY BEAN xXx[ROUGH]xXx.mp3"],
		autoplay:true,
		loop:true,
		volume:0.25
	});
	sounds["lap"]=new Howl({
		urls:["assets/audio/0.wav"],
		autoplay:false,
		loop:false,
		volume:1
	});
	sounds["cancel"]=new Howl({
		urls:["assets/audio/1.wav"],
		autoplay:false,
		loop:false,
		volume:1
	});
	sounds["select"]=new Howl({
		urls:["assets/audio/2.wav"],
		autoplay:false,
		loop:false,
		volume:1
	});
	sounds["swap"]=new Howl({
		urls:["assets/audio/3.wav"],
		autoplay:false,
		loop:false,
		volume:1
	});
	sounds["bean"]=new Howl({
		urls:["assets/audio/4.wav"],
		autoplay:false,
		loop:false,
		volume:1
	});
	sounds["dive"]=new Howl({
		urls:["assets/audio/5.wav"],
		autoplay:false,
		loop:false,
		volume:1
	});
	sounds["splash"]=new Howl({
		urls:["assets/audio/6.wav"],
		autoplay:false,
		loop:false,
		volume:1
	});
	sounds["pass"]=new Howl({
		urls:["assets/audio/7.wav"],
		autoplay:false,
		loop:false,
		volume:1
	});
	sounds["start"]=new Howl({
		urls:["assets/audio/8.wav"],
		autoplay:false,
		loop:false,
		volume:1
	});
	sounds["lose"]=new Howl({
		urls:["assets/audio/9.wav"],
		autoplay:false,
		loop:false,
		volume:1
	});
	sounds["willSwap"]=new Howl({
		urls:["assets/audio/10.wav"],
		autoplay:false,
		loop:false,
		volume:1
	});
	sounds["gameover"]=new Howl({
		urls:["assets/audio/11.wav"],
		autoplay:false,
		loop:false,
		volume:1
	});
	sounds["countdown"]=new Howl({
		urls:["assets/audio/12.wav"],
		autoplay:false,
		loop:false,
		volume:1
	});
	sounds["countdownDone"]=new Howl({
		urls:["assets/audio/13.wav"],
		autoplay:false,
		loop:false,
		volume:1
	});

	sounds["intro"]=new Howl({
		urls:["assets/audio/Bean.wav"],
		autoplay:false,
		loop:false,
		volume:1
	});
	
	sounds["whoBean"]=new Howl({
		urls:["assets/audio/WhoBean.wav"],
		autoplay:false,
		loop:false,
		volume:1
	});


	// create render texture
	renderTexture = PIXI.RenderTexture.create(size.x,size.y,PIXI.SCALE_MODES.NEAREST,1);
	 
	// create a sprite that uses the render texture
	renderSprite = new PIXI.Sprite(renderTexture, new PIXI.Rectangle(0,0,size.x,size.y));

	CustomFilter.prototype = Object.create(PIXI.Filter.prototype);
	CustomFilter.prototype.constructor = CustomFilter;

	PIXI.loader
		.add("splash","assets/img/GGJ00_GameCredits_SplashScreen.png")
		.add("help","assets/img/help.png")

		.add("screen_shader","assets/screen_shader.frag")
		.add("dive_shader","assets/dive_shader.frag")

		.add("logo_B","assets/img/logo_B.png")
		.add("logo_E","assets/img/logo_E.png")
		.add("logo_A","assets/img/logo_A.png")
		.add("logo_N","assets/img/logo_N.png")

		.add("arena","assets/img/arena.png")
		.add("lane","assets/img/lane.png")
		.add("bean","assets/img/bean.png")

		.add("lobby","assets/img/lobby.png")

		.add("joined_1","assets/img/joined_1.png")
		.add("joined_2","assets/img/joined_1.png")
		.add("joined_3","assets/img/joined_1.png")
		.add("joined_4","assets/img/joined_1.png")

		.add("ready_1","assets/img/ready_1.png")
		.add("ready_2","assets/img/ready_1.png")
		.add("ready_3","assets/img/ready_1.png")
		.add("ready_4","assets/img/ready_1.png")

		.add("win","assets/img/win.png")
		.add("medal","assets/img/medal.png")


		.add("joinText","assets/img/joinText.png")
		.add("readyText","assets/img/readyText.png");

	for(var j = 1; j <= 9; ++j){
		PIXI.loader.add("swimmer_"+j.toString(10),"assets/img/swimmer/swimmer_"+j.toString(10)+".png");
		PIXI.loader.add("swimmerbean_"+j.toString(10),"assets/img/swimmerbean/bean"+j.toString(10)+".png");
	}
	PIXI.loader
		.on("progress", loadProgressHandler)
		.load(init);
});


function CustomFilter(fragmentSource){
	PIXI.Filter.call(this,
		// vertex shader
		null,
		// fragment shader
		fragmentSource
	);
}


function loadProgressHandler(loader, resource){
	// called during loading
	console.log("loading: " + resource.url);
	console.log("progress: " + loader.progress+"%");
}


function _resize(){
	var w=$("#display").innerWidth();
	var h=$("#display").innerHeight();
	var ratio=size.x/size.y;

	
	if(w/h < ratio){
		h = Math.round(w/ratio);
	}else{
		w = Math.round(h*ratio);
	}
	
	var aw,ah;

	if(scaleMode==0){
		// largest multiple
		scaleMultiplier = 1;
		aw=size.x;
		ah=size.y;

		do{
			aw+=size.x;
			ah+=size.y;
			scaleMultiplier += 1;
		}while(aw <= w || ah <= h);

		scaleMultiplier -= 1;
		aw-=size.x;
		ah-=size.y;
	}else if(scaleMode==1){
		// stretch to fit
		aw=w;
		ah=h;
		scaleMultiplier = w/size.x;
	}else{
		// 1:1
		scaleMultiplier = 1;
		aw=size.x;
		ah=size.y;
	}

	renderer.view.style.width=aw+"px";
	renderer.view.style.height=ah+"px";
}

PIXI.zero=new PIXI.Point(0,0);