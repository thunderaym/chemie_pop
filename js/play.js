
var bounds;
var generateBound;

var goalBoard;
var hint_btn, showHint = false;
var hintText;

var protons;
var target, target_atomic_number = play_level-1;
var target_syle = {font: "32px Oduda", fill: "#a54d4b"};
var target_change_event, rnd_proton_event;
var protonLine = [];

var connects = 0;

var phase1, phase2, phase3, phase0, goal;
 
var score = 0;
var pre_score = 0;
var scoreText;
var scoreStyle = {font: "16px Nunito", fill: "#ea7f87"};
var donePercent = 0;
var combo = 0;
var comboStyle = {font: "18px Oduda", fill: "#f7941e", boundsAlignH: "center", align: "center"};

var countDown;
var timer = levelTime;
var timeText;
var time_style = {font: "28px Nunito", fill: "#ffffff"};
var counter = 0;

var line;
var spring;
var springArr = [];
var drawLine = false;

//Labels
var flashTarget;
var style = { font: "bold 144px Nunito", fill: "#fffbeb", boundsAlignH: "center", boundsAlignV: "middle" };
var statusLabel = null;
var label_style = { font: "42px Oduda", fill: "#fffbeb", boundsAlignH: "center", boundsAlignV: "middle" };

var pause = false;
var pause_btn;
var pause_screen;
var fade_black;
var machineTop, tube;
var scoreBar;

var random_generate = false;
var node = [];

var proton_dragged_group, proton_linked_group;
var boosters;
var booster_btm;
var booster_arr = [];
var booster_timer=[];

var playState = {
	
	create: function() {
				
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.restitution = 0;
		game.physics.p2.gravity.y = 0.1;		
			
		var background = game.add.sprite(0, 0, 'gameBG');
		background.scale.setTo(.5);
		
	    scoreBar = game.add.sprite(0,0,'score_bar', 0);
	    scoreBar.scale.setTo(.5);
		
		machineTop = game.add.sprite(game.world.centerX, 5.5, 'machineTop');
		machineTop.scale.setTo(.5);
		machineTop.anchor.x = .5;
		
		tube = game.add.sprite(310, 238, 'tube');
		tube.scale.setTo(.5);
		tube.anchor.setTo(1,.8);
		
		bounds = new Phaser.Rectangle(70, 160, 235, 430);//Rectangle(55, 160, 240, 380);
		generateBound = new Phaser.Rectangle(84, 220, 200, 300);
		
		proton_dragged_group = game.add.physicsGroup(Phaser.Physics.P2JS);
		proton_linked_group = game.add.physicsGroup(Phaser.Physics.P2JS);
		protons = game.add.physicsGroup(Phaser.Physics.P2JS);
		
		//Label
		statusLabel = game.add.text(game.world.centerX, game.world.centerY+20, "Ready", label_style);
		statusLabel.setShadow(0, 0, '#fff200', 4);
		statusLabel.anchor.setTo(.5);
		statusLabel.alpha = 0;
		var tween = game.add.tween(statusLabel).to({alpha: 1, y: game.world.centerY}, 500, Phaser.Easing.Exponential.InOut, true, 2800);
	    tween.onComplete.add(function(){
		    setTimeout(function(){
			    statusLabel.text = "Go!";
			    game.add.tween(statusLabel).to({alpha: 0, y: game.world.centerY-20}, 500, Phaser.Easing.Exponential.InOut, true, 500);				//Generate protons
			    random_generate = true;
				PROTON_GENERATOR(game.rnd.between(2, play_level));
				//Timer
			    countDown = game.time.events.loop(Phaser.Timer.SECOND,COUNTDOWN);			    
			    //Target
			    target_change_event = game.time.events.loop(game.rnd.between(2000, 6000), CHANGE_TARGET, this);			    
			    rnd_proton_event = game.time.events.loop(game.rnd.between(1000, 4000), CHECK_PROTON_GENERATOR, this);
			}, 1000);	    
	    }, this);
				
		//Custom Bounds
		//customBounds = { left: null, right: null, top: null, bottom: null };
		createBounds(bounds.x, bounds.y, bounds.width, bounds.height);
		
		timeSlot = [Math.round(levelTime/5),Math.round(levelTime/5),Math.round(levelTime/15*4),Math.round(levelTime/3)];
		remainingTime = timeSlot;
		for (var i =1;i<5;i++) {
			node[i-1] = play_level/4*i;
		}
		
		//Timer
		timeText = game.add.text(63, 58, timer, time_style);
		timeText.anchor.setTo(0.5, 0);
		timeText.setShadow(0, 0, "#98676e", 4);
	
		//Score
	    scoreText = game.add.text(60, 430, score, scoreStyle);
	    scoreText.anchor.setTo(0.5, 0);
	    scoreText.stroke = '#ede5be';
		scoreText.setShadow(0, 0, 'rgba(237,229,190,0.8)', 2);
	    
	    //Taps
	    currTapText = game.add.text(0, 0, '', {font: '28px Varela Round', fill: '#b0bf6b'});
		currTapText.anchor.setTo(0,1);
	    currTapText.stroke = '#c9d390';
	    currTapText.strokeThickness = 4;
		currTapText.visible = false;
	
	    //Targets
	    flashTarget = game.add.text(game.world.centerX, game.world.centerY, chemies[target_atomic_number], style);
	    flashTarget.alpha = 0;
	    flashTarget.stroke = '#ffee9e';
		flashTarget.strokeThickness = 4;
		flashTarget.setShadow(0, 0, 'rgba(255,238,158,0.5)', 8);
	    flashTarget.anchor.setTo(.5);
	    target_atomic_number=game.rnd.between(Math.floor(play_level/2), play_level-1);
	    target = game.add.text(game.world.centerX,65, chemies[target_atomic_number], target_syle);
	    target.anchor.setTo(.5);
	    
	    //Buttons
	    pause_btn = game.add.button(313.5, 75, 'pause-btn', PAUSE, this);
	    pause_btn.scale.setTo(.5);
	    pause_btn.anchor.setTo(.5);	    
	    
	    booster_btm = game.add.group();
		boosters = game.add.group();
		
		hint_btn = game.add.sprite(game.width-45, game.height-40, 'hint_btn', 1);
		hint_btn.anchor.setTo(.5);
		hint_btn.scale.setTo(.5);
		hint_btn.inputEnabled = true;
		hint_btn.events.onInputDown.add(function(){
			showHint = !showHint;
			console.log("showHint? ", showHint);
			hintText.visible = showHint;
			hint_btn.frame = showHint? 0: 1;
		}, this);
		hint_btn.input.useHandCursor = true;
		
		hintText = game.add.text(game.world.centerX, game.height/4+20,chemies[target_atomic_number]+': '+(target_atomic_number+1), {font: "18px Varela Round", fill: "#6c6b76", align: "center"});
		hintText.anchor.setTo(.5, 1);
		hintText.visible = false;
	    
	    emitter = game.add.emitter(0, 0, 8);
	    emitter.makeParticles('spark');
	    emitter.setRotation(0, 90);
		emitter.setAlpha(1, 0, 1500, Phaser.Easing.Exponential.InOut,false);
		emitter.setScale(1, 0, 1500, Phaser.Easing.Exponential.InOut,false);
		emitter.gravity = 0.005;
		
		goalBoard = game.add.sprite(game.world.centerX, -190, 'goalBoard');
		goalBoard.anchor.setTo(.5);
		goalBoard.scale.setTo(.5);
		var levelText = game.add.text(0, -94, 'LEVEL '+play_level, {font: "48px Oduda", fill: "#f0685c", align: "center"});
		var goalText = game.add.text(0, 56, goal, {font: "56px Oduda", fill: "#ef6259", align: "center"});
		goalText.anchor.setTo(.5);
		levelText.anchor.setTo(.5);
		goalBoard.addChild(goalText);
		goalBoard.addChild(levelText);
		
		var tweenGoalBoardDown = game.add.tween(goalBoard).to({y: game.world.centerY-15}, 1000, Phaser.Easing.Bounce.Out, true, 500);
		tweenGoalBoardDown.onComplete.addOnce(function(){
		    var tweenGoalBoardUp = game.add.tween(goalBoard).to({y: -190}, 800, Phaser.Easing.Exponential.Out, true, 1500);
	    }, this);		
	},

	update: function() {	
		protons.forEach(DRAGGING_OR_NOT, this, true);
		
		if (protons.total <= target_atomic_number && random_generate && timer>0) {
			CHECK_PROTON_GENERATOR(true);
		}
		if (pre_score < score) {
			if (counter < 5) {
				counter++;
			} else {
				scoreText.text = ++pre_score;
				counter = 0;
			}			
		} else {
			pre_score = score;
			scoreText.text = score;
			counter = 0;
		}
	}
};

function DRAGGING_OR_NOT(pt) {
	if (pt.lifespan<200 && !pause) {
		var pp = game.add.sprite(pt.x, pt.y, 'pt_pieces');
		pp.scale.setTo(0);
		pp.anchor.setTo(.5);
		pp.lifespan = 400;
		game.add.tween(pp.scale).to({x: .4, y: .4}, 200, Phaser.Easing.Exponential.InOut, true);
		game.add.tween(pp).to({y: pt.y+10}, 200, Phaser.Easing.Exponential.InOut, true);
	}
	var tubeZoneX = tube.x-tube.width-pt.width/2;
	var tubeZoneY = tube.y+tube.height*.2+pt.height/2;
	if (pt.y>530 && timer>0 && pt.lifespan>200) {
		pt.body.moveLeft(game.rnd.between(-30,30)); 
		pt.body.moveUp(game.rnd.between(30,100));
	}
	if (pt.x>tubeZoneX && pt.y<tubeZoneY && timer>0 && pt.lifespan>200) {
		pt.body.moveLeft(game.rnd.between(10,30)); 
		pt.body.moveUp(game.rnd.between(-30,0));
	}
	
	if( pt.input.isDragged ){	
		if( pt.body != null && timer > 0 ){
			pt.body.x = game.input.activePointer.worldX;
			pt.body.y = game.input.activePointer.worldY;
			pt.belinked = true;
			
			if (pt.pNum>1) {			
				currTapText.text = pt.pNum;// + " Protons";
				currTapText.x = game.input.activePointer.worldX+25;
				currTapText.y = game.input.activePointer.worldY;
				currTapText.visible = true;
			}
			
			pt.animations.play('tapped', 10, true);
			pt.scale.setTo(.6);
			
			if (!pt.inline) {
				protonLine.push(pt);
				pt.inline = true;				
			}					
			//console.log("dragging index: "+pt.z);
			index_of_dragging_proton = pt.z;
			protons.forEach(PROTON_LINK, this, true);
			connects = pt.pNum-1;
			protons.forEach(LINES, this, true);			
		}
	}			
}

function PROTON_LINK(pt) {
	if (pt.z!=index_of_dragging_proton) {		
	//	console.log("check index: "+pt.z);
		var distanceX = Math.abs(pt.body.x - game.input.activePointer.worldX);
		var distanceY = Math.abs(pt.body.y - game.input.activePointer.worldY);
	
		if (distanceX<pt.width && distanceY <pt.height) {
			//console.log("hit!!");
			pt.body.setZeroVelocity();
			pt.belinked = true;
			pt.lifespan = levelTime*1000;
			pt.body.data.gravityScale = 1000;
			pt.body.moves = false;
			pt.scale.setTo(.6);
			pt.animations.play('linked', 10, true);
		}	
	}
}

function LINES(pt) {
	if (pt.belinked && pt.z!=index_of_dragging_proton) {		
		var w = pt.width/2;
		var h = pt.height/2;		
		if (!pt.inline) {
			pt.body.setZeroVelocity();
			pt.body.moves = false;
			protonLine.push(pt);			
			spring = game.physics.p2.createSpring(protonLine[protonLine.length-2], pt, 0, 50, 2);		
			springArr.push(spring);			
			pt.inline = true;
		}	
		connects += pt.pNum;
		//console.log("++atomic#: "+connects);
		if (connects>0) {			
			currTapText.text = (connects+1);// + " Protons";
			currTapText.x = game.input.activePointer.worldX+25;
			currTapText.y = game.input.activePointer.worldY;
			currTapText.visible = true;
		}		
	}	
}

function FLOATING_MOVEMENT(pt) {
  	pt.body.moveLeft(game.rnd.between(-40,40)); 
  	pt.body.moveUp(game.rnd.between(-40,40)); 
}

function COUNTDOWN() {  	
	timer --;
	if (timer<0) {
		timeText.text = 0
	} else {
		timeText.text = timer;	
	}
	
	if (timer==5) {
		var halo = game.add.sprite(63, 76, 'halo');
		halo.alpha = .7;
		halo.anchor.setTo(.5);
		halo.width = 100;
		halo.height = 100;
		game.add.tween(halo).to({alpha: 0}, 300, Phaser.Easing.Exponential.InOut, true, 0, -1, true);	
		timeText.bringToTop();
	}
	
	if (timer%10==5) PROTON_GENERATOR(1, false);
	
    if (timer==0) {    
        game.time.events.removeAll();
        game.input.onDown.removeAll();
        flashTarget.alpha = 0;
        statusLabel.text = "Time's Up!";
        statusLabel.position.y = game.world.centerY - 100;
        game.add.tween(statusLabel).to({alpha: 1, y: game.world.centerY}, 500, Phaser.Easing.Exponential.InOut, true);
               
        protons.setAllChildren("body.velocity.x", 0);
		protons.setAllChildren("body.velocity.y", 0);
		
		release();
		protons.setAll("inputEnabled", false);
		game.physics.p2.gravity.y = 500;
		
		setTimeout(function(){
			game.state.start('win');
		}, 4500);
    }	
    if (timer>0 && timer%3) protons.forEach(FLOATING_MOVEMENT, this, true);
}

function startDrag(pt, pointer) {
	//console.log('startdrag');
	pt.body.moves = false;
	pt.lifespan = levelTime*1000;
	pt.body.setZeroVelocity();			
}

function stopDrag(pt) {	
	SCORING(game.input.activePointer.worldX, game.input.activePointer.worldY);
	pt.body.moves = true;
	pt.lifespan = game.rnd.between(3000, 5000);
	connects = 0;
	protons.forEach(RESET_PROTON_TAG, this, true);
	//console.log('stopdrag');
	release();
}

function release() {
	var spring;
	while (spring = game.physics.p2.world.springs.pop()) {
        game.physics.p2.onSpringRemoved.dispatch(spring);
	}	
	springArr = [];
	currTapText.visible = false;
}

function SCORING(pointerX, pointerY) {    
    //console.log("target: "+ chemies[target_atomic_number], target_atomic_number);
    //console.log("user: "+ connects);
    if (connects == target_atomic_number) { 		
  		//console.log("Chemie POP!!!");
  		var chemie;
  		if (connects>0 && connects<6) {
	  		chemie = game.add.sprite(pointerX, pointerY, chemies[connects], 8);    	
	    	chemie.animations.add('pop', [8,9,10,11,12,13,14,15], 7, true);
			chemie.animations.play('pop');	
  		} else {
	  		chemie = game.add.sprite(pointerX, pointerY, 'all_chemies_ss', connects);  
  		}    	
    	chemie.scale.setTo(.9);
    	chemie.anchor.setTo(.5);
    	
    	var p0 = new Phaser.Point(pointerX, pointerY);
        var p1 = new Phaser.Point(105, 120);  //375/2, 50
        var p2 = new Phaser.Point(243, 110);  //220, 20
        var p3 = new Phaser.Point(280, 196);  //270, 180
	
		var tween = game.add.tween(chemie).to({
	            y: [p0.y, p1.y, p2.y, p3.y],
	            x: [p0.x, p1.x, p2.x, p3.x]
	        }, 1500, Phaser.Easing.Quadratic.InOut, true)	        
	        .interpolation(function(v, k){
	            return Phaser.Math.bezierInterpolation(v, k);
	        });
		
		var tweenS = game.add.tween(chemie.scale).to({
			x: 0.15,
			y: 0.15	
		}, 1500, Phaser.Easing.Quadratic.InOut, true);
		if (tube.scale.x>=.47) {
			game.add.tween(tube.scale).to({x: .4, y: .4}, 200, Phaser.Easing.Quadratic.InOut, true, 1400, 0, true);
		}
		tweenS.onComplete.add(function(){
			//sparkling
			ChemiePopFX(p3);
			chemie.alpha = 0;
		}, this);
				
		combo++;
		//console.log("combo: " + combo);
		if (combo>=2) {
			if (combo==4) FIRE_BOOSTER(0);
			if (combo==8) {
				//console.log('booster_timer.length=', booster_timer.length);
				booster_timer.length>0? FIRE_BOOSTER(1):FIRE_BOOSTER(0);
			}
			if (combo==12)  {
				booster_timer.length>1? FIRE_BOOSTER(2): booster_timer.length>0? FIRE_BOOSTER(1):FIRE_BOOSTER(0);
			}
		}
		
		SCORE_UP_EFFECT(combo, pointerX, pointerY);
		
		protons.forEach(KILL, this, true);
			CHECK_PROTON_GENERATOR(true);
	    } 
    else {
	    if (combo>2) {
	    	var combo_t_b = game.add.text(pointerX, pointerY, 'COMBO\nBREAK', comboStyle);
		    combo_t_b.stroke = '#c9c8ed';
			combo_t_b.setShadow(0, 0, 'rgba(200,200,237,0.5)', 4);
		    combo_t_b.fill = '#6c6b76';
		    combo_t_b.anchor.setTo(0.5, 1);
		    combo_t_b.lineSpacing = -10;
			combo_t_b.scale.setTo(0);
			game.add.tween(combo_t_b.scale).to({x: 1, y: 1}, 800, Phaser.Easing.Exponential.InOut, true);
			var tween = game.add.tween(combo_t_b).to({alpha: 0}, 800, Phaser.Easing.Exponential.InOut, true, 1000);
			tween.onComplete.add(function(){
				combo_t_b.destroy();
			}, this);    	
	    }
		combo = 0;    	    
    }
}

function ChemiePopFX(p) {
	emitter.x = p.x;
    emitter.y = p.y;
	//explode,lifespan,ignored when using burst/explode mode,particles value
	emitter.start(true, 1500, null, 8);
}

function SCORE_UP_EFFECT(combo, pointerX, pointerY) {
	
	if (combo>=2) {
		var combo_t = game.add.text(pointerX, pointerY, 'COMBO ' + combo, comboStyle);
	    combo_t.fill = '#f7941e';
		combo_t.setShadow(0, 0, '#f2d935', 4);
	    combo_t.anchor.setTo(0.5, 1);
	    combo_t.lineSpacing = -10;
		combo_t.scale.setTo(0);
		game.add.tween(combo_t.scale).to({x: 1, y: 1}, 800, Phaser.Easing.Exponential.InOut, true);
		game.add.tween(combo_t).to({y: pointerY-20}, 800, Phaser.Easing.Exponential.InOut, true);
		var tween = game.add.tween(combo_t).to({alpha: 0}, 800, Phaser.Easing.Exponential.InOut, true, 1000);
		tween.onComplete.add(function(){
			combo_t.destroy();
		}, this);
	}
	var pt_t = game.add.text(pointerX, pointerY, '+ '+((target_atomic_number+1)*combo), comboStyle);
    pt_t.fill = '#f7941e';
	pt_t.setShadow(0, 0, '#f2d935', 4);
    pt_t.anchor.setTo(0.5, 1);
    pt_t.lineSpacing = -10;
    pt_t.scale.setTo(0);
	game.add.tween(pt_t.scale).to({x: 1, y: 1}, 800, Phaser.Easing.Exponential.InOut, true);
	var tween = game.add.tween(pt_t).to({alpha: 0}, 800, Phaser.Easing.Exponential.InOut, true, 1000);
	tween.onComplete.add(function(){
		pt_t.destroy();
	}, this);
	
	score += (target_atomic_number+1)*combo;

	if (score>=phase3) {
		scoreBar.frame=4;
	} else if (score>=phase2) {
		scoreBar.frame=3;
	} else if (score>=phase1) {
		scoreBar.frame=2;
	} else if (score>=phase0) {
		scoreBar.frame=1;
	}
}

function KILL(pt) {
	if (pt.belinked) {
		pt.kill();
	}
}

function RESET_PROTON_TAG(pt) {
	pt.body.static = false;
	if (pt.belinked) {
		pt.belinked = false;
		pt.animations.paused = true;
		pt.animations.frame = 0;
		if (pt.pNum>1) {
			pt.scale.setTo(game.device.desktop? .4:.6);
		} else {
			pt.scale.setTo(.5);
		}
		pt.body.data.gravityScale = 1;
	}
	if (pt.inline) {
		pt.inline = false;
	}
}
			
function CHANGE_TARGET() {	
	var rndTarget;
	var ramdon0123 = weightedRand({0:0.2, 1:0.2, 2:0.27, 3: 0.33});
	var rndTargetZone = ramdon0123();
	
	if (rndTargetZone == 3) {
		rndTarget = play_level;
	} else if(rndTargetZone == 2) {
		rndTarget = PickTarget(Math.ceil(node[2]), play_level-1);
	} else if(rndTargetZone == 0) {
		rndTarget = PickTarget(1, Math.floor(node[1]));
	} else {
		rndTarget = PickTarget(Math.ceil(node[1]), Math.floor(node[2]));
	}

    flashTarget.text = chemies[rndTarget-1];
    
    var tweenA = game.add.tween(flashTarget).to( { alpha: 1 }, 800, Phaser.Easing.Exponential.InOut, true);
    var tweenB = game.add.tween(flashTarget).to( { alpha: 0 }, 500, Phaser.Easing.Exponential.InOut, true);
    tweenA = tweenA.chain(tweenB);
    tweenA.onComplete.add(function(){
	    target_atomic_number = rndTarget-1;
	    target.text = chemies[target_atomic_number];
	    if (showHint) {
		    hintText.text = chemies[target_atomic_number]+': '+ (target_atomic_number+1);		    
	    }
    }, 0);        
}

function PickTarget(min, max) {	
	return game.rnd.between(min, max);		
}

function weightedRand(spec) {
  var i, j, table=[];
  for (i in spec) {
    for (j=0; j<spec[i]*100; j++) {
      table.push(i);
    }
  }
  return function() {
    return table[Math.floor(Math.random() * table.length)];
  }
}

function CHECK_PROTON_GENERATOR(is_proton) {
	var total_p = 0;
	protons.forEachExists(function(pt){
		if (pt.pNum==1) total_p += pt.pNum;
	}, this, true);
	
	if (total_p<=target_atomic_number) {
		PROTON_GENERATOR(game.rnd.between(target_atomic_number-total_p+1, target_atomic_number-total_p+4), is_proton);	
	}	
}

function PROTON_GENERATOR(quantity, is_proton) {
	var proton_key = game.device.desktop? 'proton_ss':'proton_ll';
	var delay = 0;	
	for (var i = 0; i < quantity; i++) {		
		var pX = generateBound.randomX;
		var pY = generateBound.randomY;
		
		var proton;
		var scale = 0.5;
		var replace = game.rnd.between(1,5)%5;
		if (is_proton==false) replace = 0;
				
		if (replace==0 && unlocked_chemies_arr.length>0 && play_level>4 && !is_proton) {
			var cm = unlocked_chemies_arr[game.rnd.between(0,unlocked_chemies_arr.length-1)];
			if (cm[1]<play_level-1) {
				proton = protons.create(pX, pY, cm[0], 0);
				proton.pNum = cm[1];
				proton.body.angle = game.rnd.integerInRange(-45, 45);
				scale = game.device.desktop? .4:.6;
				proton.lifespan = game.rnd.integerInRange(3000, 6000);
			} else {				
				proton = protons.create(pX, pY, proton_key, 0);
				proton.pNum = 1;
				proton.body.angle = game.rnd.integerInRange(0, 359);
				proton.lifespan = game.rnd.integerInRange(6000, 19000);
			}				
		}
		else {
			proton = protons.create(pX, pY, proton_key, 0);
			proton.pNum = 1;
			proton.body.angle = game.rnd.integerInRange(0, 359);
			proton.lifespan = game.rnd.integerInRange(6000, 19000);
		}
	
        proton.scale.setTo(0);
        proton.body.setCircle(22);
        game.physics.enable(proton, Phaser.Physics.P2JS);
     
        proton.belinked = false;
        proton.inline = false;
         
        proton.inputEnabled = true;
        proton.input.enableDrag();
        proton.input.boundsRect = bounds;
        
        proton.events.onDragStart.add(startDrag, this);
		proton.events.onDragStop.add(stopDrag, this);
		
		game.add.tween(proton.scale).to({
			x: scale,
			y: scale	
		}, 1000, Phaser.Easing.Exponential.InOut, true, delay);		
		delay += 200;
    }
    protons.callAll('animations.add', 'animations', 'tapped', [0,1,2,3,4,5,6,7], 10, true);
    protons.callAll('animations.add', 'animations', 'linked', [8,9,10,11,12,13,14,15], 10, true);
}

function FIRE_BOOSTER(booster_index) {
    var rnd_booster;
    var booster_pX;
    if (play_level<=3) return;
    if (play_level<11) {
    	//X: 306, 444
	    //booster_qt = 2;
	     if (booster_index==0) {
	     	if (boosters.length>0) {
	     		BOOSTER_COUNTDOWN(null, null, 0);
	     		return; 
	     	}
	     	booster_pX = 153;
	     	rnd_booster = 1;
	     } else if (booster_index==1) {
	     	if (boosters.length>1) {
	     		BOOSTER_COUNTDOWN(null, null, 1);
	     		return; 
	     	}
	     	booster_pX = 222;
	     	if (play_level==4) {
	     		rnd_booster = 2;
	     	} else {
		     	rnd_booster=game.rnd.between(2,3);
	     	}	     	
	     } else {
		     return;
	     }
	     booster_arr[booster_index] = rnd_booster;
    } else if (play_level>10) {
    	//X: 236, 375, 514
	    //booster_qt = 3;
	    if (booster_index==0) {
	    	if (boosters.length>0) {
	     		BOOSTER_COUNTDOWN(null, null, 0);
	     		return; 
	     	}
	     	booster_pX = 118;
	     	rnd_booster = 1;	     	
	     } else if (booster_index==1) {
	     	if (boosters.length>1) {
	     		BOOSTER_COUNTDOWN(null, null, 1);
	     		return; 
	     	}
	     	booster_pX = 187.5;
	     	rnd_booster=game.rnd.between(2,3);
	     } else {
	     	if (boosters.length>2) {
	     		BOOSTER_COUNTDOWN(null, null, 2);
	     		return; 
	     	}
		    booster_pX = 257;
		    rnd_booster=game.rnd.between(4,5);
	     }
	     booster_arr[booster_index] = rnd_booster;
    }
    //console.log('boosters: ', chemies[rnd_booster]);
    //Y: 639, 630
	var btm = booster_btm.create(booster_pX, 639, 'booster_btm');
	btm.anchor.setTo(.5, 1);
	btm.scale.setTo(0);
	//game.add.button(pX, pY, 'level-btn', goToLevel, this, btn_frame, btn_frame, btn_frame, btn_frame, levels);
    var bt = game.add.button(booster_pX, 632, 'booster_btns', BOOSTER, this, booster_index, booster_index, booster_index, booster_index, boosters);
    bt.anchor.setTo(.5, 1);
    bt.scale.setTo(0);
    var symbol = game.add.text(0,-40,chemies[rnd_booster],{font: "30px Varela Round", fill: "#ffffff", boundsAlignH: "center", align: "center"});
    symbol.anchor.setTo(.5);
    bt.addChild(symbol);

	var tA = game.add.tween(bt.scale).to({x: .55, y: .55}, 500, Phaser.Easing.Back.InOut, true); 
	game.add.tween(bt).to({angle: 10}, 500, Phaser.Easing.Back.InOut, true, 0, 0, true);
	game.add.tween(bt).to({y: game.height-64}, 500, Phaser.Easing.Exponential.InOut, true, 0, 0, true);
	game.add.tween(btm.scale).to({x: .55, y: .55}, 500, Phaser.Easing.Back.InOut, true);
	game.add.tween(btm).to({angle: 10}, 500, Phaser.Easing.Back.InOut, true, 0, 0, true);
	game.add.tween(btm).to({y: game.height-58}, 500, Phaser.Easing.Exponential.InOut, true, 0, 0, true);
	tA.onComplete.add(function(){
		setTimeout(BLING_BLING(booster_pX, 620, 'star2'), 300);
		game.time.events.add(0, BOOSTER_COUNTDOWN, this, bt, btm, booster_index);
    }, this);
    
}

function BOOSTER_COUNTDOWN(bt, btm, index) {
	var last_time = 4000;
	if (booster_timer[index]!=null) {
		var boosterTimer = booster_timer[index];
		game.time.events.remove(boosterTimer);
		booster_timer[index] = game.time.events.add(5100+last_time, REMOVE_BOOSTER, this, boosters.getAt(index), booster_btm.getAt(index));		
	} else {
		booster_timer[index] = game.time.events.add(5100, REMOVE_BOOSTER, this, bt, btm);		
	}
	for (var i=index-1;i>=0;i--) {
		var boosterTimer = booster_timer[i];
		console.log(booster_timer.length);
		game.time.events.remove(boosterTimer);
		console.log(booster_timer.length);
		booster_timer[i] = game.time.events.add(5100+((i+1)%2*0.5+1)*last_time, REMOVE_BOOSTER, this, boosters.getAt(i), booster_btm.getAt(i));
	} 	
}

function REMOVE_BOOSTER(bt, btm) {
	//Phaser.Group.remove(child, destroy, silent)
	var tA = game.add.tween(bt.scale).to({x: 0, y: 0}, 500, Phaser.Easing.Back.InOut, true);
	game.add.tween(bt).to({angle: 10}, 500, Phaser.Easing.Back.InOut, true, 0, 0, true); 
	game.add.tween(btm.scale).to({x: 0, y: 0}, 500, Phaser.Easing.Back.Out, true);
	game.add.tween(btm).to({angle: 10}, 500, Phaser.Easing.Back.Out, true, 0, 0, true); 
	tA.onComplete.add(function() {
		boosters.remove(bt, true);
		booster_btm.remove(btm, true);
		BLING_BLING(bt.x, bt.y-10, 'spark');
	}, this);
}

function BOOSTER(button) {
	if (button.scale<0.55) return;
    var tween = game.add.tween(button.scale).to({x: 0.45, y: 0.45}, 200, Phaser.Easing.Exponential.InOut, true, 0, 0, true);
    var pt;
    for (var i=0;i<protons.length;i++) {
	    pt = protons.getAt(i);
	    if (pt.pNum==1 && pt.alive) break;
    }
	//console.log('pNum: ', pt.pNum);
	pt.pNum = booster_arr[button.z-1]+1;
	//pt.alpha = .5;
	pt.lifespan = game.rnd.between(5,8)*1000;
	//console.log('pNum: ', pt.pNum);
	pt.body.sprite.loadTexture(chemies[pt.pNum-1],0);
	pt.scale.setTo(game.device.desktop?.4:.6);		
}

function PAUSE_MENU(btn) {
	var tween = game.add.tween(btn.scale).to({x: 0.4, y: 0.4}, 200, Phaser.Easing.Exponential.InOut, true, 200, 0, true);
	tween.onComplete.add(function(){
		if (btn.frame == 1) {
			RESETGAME(play_level);
			game.state.start('play');
		} else if (btn.frame == 2) {
			RESETGAME(play_level);
			game.state.start('level');	
		}  else {
			game.add.tween(pause_screen).to({alpha: 0}, 500, Phaser.Easing.Exponential.InOut, true);			
	    	pause_screen.destroy();   	
	    	pause = !pause;
		}
		countDown.timer.paused = false;
		hint_btn.input.enabled = true;
    	target_change_event.timer.paused = false;
    	rnd_proton_event.timer.paused = false;
    	for (var i=0;i<booster_timer.length;i++) {
	    	booster_timer[i].timer.paused = false;
    	}
	}, this);
}

function PAUSE() {
	if (goalBoard.y+goalBoard.height/2>0 || pause || Math.abs(statusLabel.y-game.world.centerY)<20) return;
	pause = !pause;
	hint_btn.input.enabled = false;
	pause_screen = game.add.group();
	var tween = game.add.tween(pause_btn.scale).to({x: 0.4, y: 0.4}, 200, Phaser.Easing.Exponential.InOut, true, 0, 0, true);
    tween.onComplete.add(function(){
    	countDown.timer.paused = true;
    	target_change_event.timer.paused = true;
    	rnd_proton_event.timer.paused = true;
    	for (var i=0;i<booster_timer.length;i++) {
	    	booster_timer[i].timer.paused = true;
    	}
    }, this);
    fade_black = game.add.sprite(0, 0, 'black-fade', 0, pause_screen);
    fade_black.alpha = 0;
    var tweenB = game.add.tween(fade_black).to({alpha: .9}, 500, Phaser.Easing.Exponential.InOut, true, 400);
  
    // Add Menu
	var pX = game.world.centerX;
    var pY = 210;
    var delay = 0;
    for (var i=0;i<3;i++) {
	    var btn = game.add.button(pX, pY+i*70, 'pause-screen-btns', PAUSE_MENU, this, i, i, i, i, pause_screen);
		btn.scale.setTo(0);
		btn.anchor.setTo(.5);
		game.add.tween(btn.scale).to({x: .5, y: .5}, 500, Phaser.Easing.Back.InOut, true, delay);
		delay+=200;
    }
    var elems = game.add.group();
    var elem1 = game.add.sprite(game.world.centerX-40, game.height-35, (play_level<7)? chemies[play_level-1]:'all_chemies_ss', (play_level<7)? 0: play_level-1, (play_level<7)? elems:pause_screen);
    elem1.anchor.setTo(.5);
    elem1.scale.setTo(0);
    elem1.angle = -14;
    var t1 = game.add.tween(elem1.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Back.InOut, true);
    	    
    elem2 = game.add.sprite(game.world.centerX+70, game.height-30, (play_level>2 && play_level<8)? chemies[play_level-2]:(play_level==2)? chemies[1]:chemies[game.rnd.between(1,5)], 0, (play_level==2)? pause_screen:elems);
    elem2.anchor.setTo(.5);
    elem2.scale.setTo(0);
    elem2.angle = 23;
    game.add.tween(elem2.scale).to({x: .88, y: .88}, 500, Phaser.Easing.Back.InOut, true, 100);	 
    //game.add.tween(elem2.scale).to({x: .45, y: .45}, 500, Phaser.Easing.Back.InOut, true, 100);	
	
	var rnd = game.rnd.between(0,5);
	elem = game.add.sprite(35, 30, (play_level<7)? chemies[game.rnd.between(1,play_level-1)]:chemies[rnd], 0, (rnd==0)? pause_screen:elems);
    elem.anchor.setTo(.5);
    elem.scale.setTo(0);
    elem.angle = 160;
    game.add.tween(elem.scale).to({x: .92, y: .92}, 500, Phaser.Easing.Back.InOut, true, 200);
    //game.add.tween(elem.scale).to({x: .55, y: .55}, 500, Phaser.Easing.Back.InOut, true, 200);	
    
    rnd = game.rnd.between(0,5);
    elem = game.add.sprite(game.width-20, game.height-300, (play_level<7)? chemies[game.rnd.between(1,play_level-1)]:chemies[rnd], 0, (rnd==0)? pause_screen:elems);
    elem.anchor.setTo(.5);
    elem.scale.setTo(0);
    elem.angle = -43;
    game.add.tween(elem.scale).to({x: .92, y: .92}, 500, Phaser.Easing.Back.InOut, true, 300);
    //game.add.tween(elem.scale).to({x: .55, y: .55}, 500, Phaser.Easing.Back.InOut, true, 300);	
    
    elems.callAll('animations.add', 'animations', 'pOne', [0,1,2,3,4,5,6,7], 5, true);
    elems.forEach(function(spt){
    	spt.animations.play('pOne');
    }, this, true);
    
    pause_screen.add(elems);
    
    var pt = game.add.sprite(85, 520, 'proton_ss', 0, pause_screen);		
    pt.scale.setTo(0);
    pt.anchor.setTo(0.5);
	pt.angle = 5;
	game.add.tween(pt.scale).to({x: .55, y: .55}, 1000, Phaser.Easing.Back.InOut, true);	
	pt.animations.add('express');
	pt.animations.play('express', 5, true);	
	BounceTween_noShadow(pt);
	
	var pt2 = game.add.sprite(110, 440, 'proton_ss', 0, pause_screen);		
    pt2.scale.setTo(0);
    pt2.anchor.setTo(0.5);
	pt2.angle = -5;       		
	game.add.tween(pt2.scale).to({x: 0.4, y: 0.4}, 1000, Phaser.Easing.Exponential.InOut, true, 200);
	pt2.animations.add('express', [0,1,2,3,4,5,6,7]);
	pt2.animations.play('express', 5, true)	
	BounceTween_noShadow(pt2);		   	       
}

function setGoal(levelTime, level) {
	phase0=Math.ceil(2*levelTime*(play_level/5+2)/3); //Level chemie pops w/o combo, Math.ceil(4/3*levelTime);             				  
	phase1=Math.ceil(phase0*2);					//Level chemie pops + other chemie pops w/o combo
	phase2=Math.ceil(phase0*2.5);					//Level chemies pops + other chemie pops w/ combos
	phase3=phase2+Math.ceil(4/level+96/level/level);  // w/ combos
	goal = phase1;
	
	console.log('GOAL: '+goal,phase0,phase1,phase2,phase3);
}

function RESETGAME(level) {
	play_level = level;
	score = 0;
	random_generate = false;
	donePercent = 0;
	levelTime = 20+Math.floor(play_level/5)*5;
	//levelTime = 3;
	timer = levelTime;
	combo = 0; 
    connects = 0
    pause = false;
    showHint = false;
    setGoal(levelTime, play_level);
}

function createBounds(x, y, w, h) {
    var sim = game.physics.p2;

    //  If you want to use your own collision group then set it here and un-comment the lines below
    var mask = sim.boundsCollisionGroup.mask;

    customBounds.left = new p2.Body({ mass: 0, position: [ sim.pxmi(x), sim.pxmi(y) ], angle: 1.5707963267948966 });
    customBounds.left.addShape(new p2.Plane());
    // customBounds.left.shapes[0].collisionGroup = mask;

    customBounds.right = new p2.Body({ mass: 0, position: [ sim.pxmi(x + w), sim.pxmi(y) ], angle: -1.5707963267948966 });
    customBounds.right.addShape(new p2.Plane());
    // customBounds.right.shapes[0].collisionGroup = mask;

    customBounds.top = new p2.Body({ mass: 0, position: [ sim.pxmi(x), sim.pxmi(y) ], angle: -3.141592653589793 });
    customBounds.top.addShape(new p2.Plane());
    // customBounds.top.shapes[0].collisionGroup = mask;

    customBounds.bottom = new p2.Body({ mass: 0, position: [ sim.pxmi(x), sim.pxmi(y + h) ] });
    customBounds.bottom.addShape(new p2.Plane());
    // customBounds.bottom.shapes[0].collisionGroup = mask;

    sim.world.addBody(customBounds.left);
    sim.world.addBody(customBounds.right);
    sim.world.addBody(customBounds.top);
    sim.world.addBody(customBounds.bottom);
}