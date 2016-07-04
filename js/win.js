
var result_box;
var result_box_back, result_box_front, percent;
var total_score, counter = 0, done, perCounter = 0;
var stop = false;
var levelComplete = 0;
var fall_burst_event;

var result_next_btn, result_replay_btn, result_cc_btn, result_rk_btn, result_home_btn;
var completeBoard, resultBoard, boardLevel, boardCplted, boardFailed;
var bulbs = [];
var levelText, levelText2;
var btn_bottom = [];
var unlockChemie, emitter2;
var f_chemie;
var f_arr = [];

var few, half, full;
var boxSize = '';

var winState = {
	
	create: function() {
	
		WINorLOSS();
		prevState = 'win';
		var background = game.add.sprite(0, 0,'resultBG');
		background.scale.setTo(.5);
		counter = 0;
		perCounter = 0;
		
		resultBoard = game.add.sprite(game.world.centerX, 53, 'result_board');
		resultBoard.scale.setTo(.5);
		resultBoard.anchor.setTo(.5, 0);
		offBulb0 = game.add.sprite(147, 70, 'complete-bulb-l');
		offBulb0.scale.setTo(.5);
		offBulb0.anchor.setTo(.5, 1);
		offBulb1 = game.add.sprite(game.world.centerX, 62, 'complete-bulb-m');
		offBulb1.scale.setTo(.5);
		offBulb1.anchor.setTo(.5, 1);
		offBulb2 = game.add.sprite(227, 70, 'complete-bulb-r');
		offBulb2.scale.setTo(.5);
		offBulb2.anchor.setTo(.5, 1);
		
		boardLevel = game.add.sprite(game.world.centerX+2, 71, 'result_level');
		boardLevel.scale.setTo(0.5);
		boardLevel.anchor.setTo(.5, 0);
			
		levelText2 = game.add.text(game.world.centerX+2, 98, play_level, {font: '30px Oduda', fill: "#f4d755", align: "center"});
		levelText2.anchor.setTo(0.5, 0);
		levelText = game.add.text(game.world.centerX, 97, play_level, {font: '30px Oduda', fill: "#ea6880", align: "center"});
		levelText.anchor.setTo(0.5, 0);
		levelText.setShadow(-2, 0, 'rgba(108,107,118,0.5)', 0);
		
		boardCplted = game.add.sprite(game.world.centerX+2, 122, 'result_completed');
		boardCplted.scale.setTo(0);
		boardCplted.anchor.setTo(.5);
		boardFailed = game.add.sprite(game.world.centerX+2, 119, 'result_failed');
		boardFailed.scale.setTo(0);
		boardFailed.anchor.setTo(.5);
		
		for (var i=0;i<3;i++) {
			bulbs[i]=game.add.sprite(game.world.centerX,59, 'complete-bulb-on-'+i);
			bulbs[i].anchor.setTo(.5,1);
			bulbs[i].scale.setTo(.5);
			bulbs[i].alpha = 0;
		}
		bulbs[0].position.setTo(147,68);
		bulbs[2].position.setTo(228,68);
		
		var total_score_label = game.add.text(game.world.centerX, 174, 'TOTAL SCORE', {font: '12px Oduda', fill: "#98676e", align: "center"});
		total_score_label.anchor.setTo(.5, 0);
		total_score = game.add.text(game.world.centerX, 192, 0, {font: '18px Oduda', fill: "#f2a81d", align: "center"});
		total_score.anchor.setTo(.5, 0);
		
		result_box_back = game.add.sprite(game.world.centerX, game.world.centerY+154, 'popcornBox_back'); //977.548/2
		result_box_back.scale.setTo(.55);
		result_box_back.anchor.setTo(.5, 1);
		
		RANDOM_FALL();
		
		few = game.add.group();
		half = game.add.group();
		full = game.add.group();		
		if (donePercent==100) {
			//console.log('boxSize: full');
			BOX_FILL_FEW();
			BOX_FILL_HALF();
			BOX_FILL_FULL();			
		} else if (donePercent>=60) {
			//console.log('boxSize: half');
			BOX_FILL_FEW();
			BOX_FILL_HALF();
		} else if (donePercent<60) {
			//console.log('boxSize: few');
			BOX_FILL_FEW();
		} else if (donePercent<30) {
			//console.log('boxSize: empty');
		}
		few.alpha = 0;
		half.alpha = 0;
		full.alpha = 0;
		
		result_box_front = game.add.sprite(game.world.centerX, game.world.centerY+164, 'popcornBox_front'); //995.604/2
		result_box_front.scale.setTo(.55);
		result_box_front.anchor.setTo(.5, 1);

		done = game.add.text(game.world.centerX-18+(5*Math.floor(donePercent/100)), game.world.centerY+80, donePercent, {font: '27px Oduda', fill: "#f2a81d", align: "center"});
		done.anchor.setTo(1, 1);
		percent = game.add.text(game.world.centerX-16+(4*Math.floor(donePercent/100)), game.world.centerY+76, "%", {font: '14px Oduda', fill: "#f2a81d", align: "center"});
		percent.anchor.setTo(0, 1);
		
		fall_burst_event = game.time.events.loop(500, FALL_BURST, this);
				
		btn_bottom[0] = game.add.sprite(game.world.centerX-90, 534, 'result_btnBtm_l');
		btn_bottom[1] = game.add.sprite(game.world.centerX, 550, 'result_btnBtm_l');
		btn_bottom[2] = game.add.sprite(game.world.centerX+90, 534, 'result_btnBtm_l');
		btn_bottom[3] = game.add.sprite(game.world.centerX-50, 612, 'result_btnBtm_s');
		btn_bottom[4] = game.add.sprite(game.world.centerX+50, 612, 'result_btnBtm_s');
		for (var i=0;i<5;i++) {
			btn_bottom[i].anchor.setTo(.5);
			btn_bottom[i].scale.setTo(0);
		}
		
		result_home_btn = game.add.button(game.world.centerX-90, 548, 'result_home_btn', buttonUp, this);
		result_home_btn.scale.setTo(0);
		result_home_btn.anchor.setTo(.5, 1);
		
		result_replay_btn = game.add.button(game.world.centerX, 564, 'result_re_btn', buttonUp, this);
		result_replay_btn.scale.setTo(0);
		result_replay_btn.anchor.setTo(.5, 1);
		
		result_next_btn = game.add.button(game.world.centerX+90, 548, 'result_next_btn', buttonUp, this);
		result_next_btn.scale.setTo(0);
		result_next_btn.anchor.setTo(.5, 1);
		
		result_cc_btn = game.add.button(game.world.centerX-50, 624, 'result_cc_btn', buttonUp, this);
		result_cc_btn.scale.setTo(0);
		result_cc_btn.anchor.setTo(.5, 1);
		
		result_rk_btn = game.add.button(game.world.centerX+50, 624, 'result_rk_btn', buttonUp, this);
		result_rk_btn.scale.setTo(0);
		result_rk_btn.anchor.setTo(.5, 1);
		
		result_btns = game.add.group();
		result_btns.addMultiple([result_home_btn,result_replay_btn,result_next_btn,result_cc_btn,result_rk_btn]);

		unlockChemie = game.add.sprite(game.world.centerX, game.world.centerY, (play_level<7)? chemies[play_level-1]:'all_chemies_ss', (play_level<7)? 0:play_level-1);
		unlockChemie.scale.setTo(0);
		unlockChemie.anchor.setTo(.5);
		if (play_level<7) unlockChemie.animations.add('wink', [8,9,10,11,12,13,14,15], 5, true);
	}, 
	
	update: function() {
		
		if (counter < score) {
			total_score.text = counter;
			counter++;
		} else {
			total_score.text = score;
		}
		
		if (perCounter < donePercent) {
			done.text = perCounter;
			perCounter++;
		} else {			
			done.text = donePercent;
			showBoard();
			stop = true;					
		}
		if (perCounter == 30) few.alpha = 1;
		if (perCounter == 60) half.alpha = 1;
		if (perCounter == 100) full.alpha = 1;
	}
	
};

function showBoard() {
	if (!stop) {
		f_chemie.destroy();
		game.add.tween(done.scale).to({x: 1.25, y: 1.25}, 300, Phaser.Easing.Bounce.Out, true, 0, 0, true);
		game.add.tween(percent.scale).to({x: 1.25, y: 1.25}, 300, Phaser.Easing.Bounce.Out, true, 0, 0, true);
		LAST2CHEMIES();
		game.time.events.remove(fall_burst_event);
		var tween = game.add.tween(levelText).to({alpha: 0}, 500, Phaser.Easing.Bounce.Out, true);
		var tween1 = game.add.tween(levelText2).to({alpha: 0}, 500, Phaser.Easing.Bounce.Out, true);
		if (levelComplete) {
			game.add.tween(boardCplted.scale).to({x: .5, y: .5}, 300, Phaser.Easing.Bounce.Out, true, 200);
			setTimeout(function(){
				game.time.events.loop(2000, function(){
					BLING_BLING(167, 120, 'spark');
				}, this);
			}, 200);
			setTimeout(function(){
				game.time.events.loop(2000, function(){
					BLING_BLING(227, 110, 'spark');
				}, this);
			}, 500);
		} else {
			game.add.tween(boardFailed.scale).to({x: .5, y: .5}, 300, Phaser.Easing.Bounce.Out, true, 200);
		}				
		tween.onComplete.add(function(){
			if (score >= phase3) {
				var tween1 = game.add.tween(bulbs[0]).to({alpha: 1}, 500, Phaser.Easing.Bounce.Out, true);
				game.time.events.loop(1000, function(){
					BLING_BLING(148, 55, 'star2');
				}, this);
				var tween2 = game.add.tween(bulbs[1]).to({alpha: 1}, 500, Phaser.Easing.Bounce.Out, true, 200);
				setTimeout(function(){
					game.time.events.loop(1000, function(){
						BLING_BLING(188, 41, 'star2');
					}, this);			
				}, 200);				
				var tween3 = game.add.tween(bulbs[2]).to({alpha: 1}, 500, Phaser.Easing.Bounce.Out, true, 400);
				setTimeout(function(){
					game.time.events.loop(1000, function(){
						BLING_BLING(227, 55, 'star2');
					}, this);	
				}, 400);				
				tween3.onComplete.add(function(){
					var flashing = game.add.sprite(124, 28, 'flash_bulb_1', 0);
					flashing.scale.setTo(.5);
					flashing.animations.add('flash');
					flashing.animations.play('flash', 2, true);
					setTimeout(function(){
						var flashing2 = game.add.sprite(163, 13, 'flash_bulb_2', 0);
						flashing2.scale.setTo(.5);
						flashing2.animations.add('flash2');
						flashing2.animations.play('flash2', 2, true);
					}, 500);
					setTimeout(function(){
						var flashing3 = game.add.sprite(208, 28, 'flash_bulb_3', 0);
						flashing3.scale.setTo(.5);
						flashing3.animations.add('flash3');
						flashing3.animations.play('flash3', 2, true);
					}, 1000);
				}, this);
				setTimeout(UNLOCKED, 2000);
			} else if (score>=phase2) {
				var tween1 = game.add.tween(bulbs[0]).to({alpha: 1}, 500, Phaser.Easing.Bounce.Out, true);
				game.time.events.loop(1000, function(){
					BLING_BLING(148, 55, 'star2');
				}, this);
				var tween2 = game.add.tween(bulbs[1]).to({alpha: 1}, 500, Phaser.Easing.Bounce.Out, true, 200);
				setTimeout(function(){
					game.time.events.loop(1000, function(){
						BLING_BLING(188, 41, 'star2');
					}, this);
				}, 200);
				tween2.onComplete.add(function(){				
					var flashing = game.add.sprite(124, 28, 'flash_bulb_1', 0);
					flashing.scale.setTo(.5);
					flashing.animations.add('flash');
					flashing.animations.play('flash', 2, true);				
					setTimeout(function(){
						var flashing2 = game.add.sprite(163, 13, 'flash_bulb_2', 0);
						flashing2.scale.setTo(.5);
						flashing2.animations.add('flash2');
						flashing2.animations.play('flash2', 2, true);
					}, 500);
				}, this);
				showBtn();
			} else if (score>=phase1) {
				var tween1 = game.add.tween(bulbs[0]).to({alpha: 1}, 500, Phaser.Easing.Bounce.Out, true);
				game.time.events.loop(1000, function(){
					BLING_BLING(148, 55, 'star2');
				}, this);				
				tween1.onComplete.add(function(){
					var flashing = game.add.sprite(124, 28, 'flash_bulb_1', 0);
					flashing.scale.setTo(.5);
					flashing.animations.add('flash');
					flashing.animations.play('flash', 2, true);
				}, this);
				showBtn();
			} else {
				showBtn();
			}
		}, this);		
	}	
}

function showBtn() {
	if (levelComplete) {
		var tweenA = game.add.tween(result_home_btn.scale).to({x: .5, y: .5}, 800, Phaser.Easing.Bounce.InOut,true);
		game.add.tween(btn_bottom[0].scale).to({x: .5, y: .5}, 800, Phaser.Easing.Bounce.InOut,true);	
		var tweenB = game.add.tween(result_replay_btn.scale).to({x: .5, y: .5}, 800, Phaser.Easing.Bounce.InOut,true, 100);
		game.add.tween(btn_bottom[1].scale).to({x: .5, y: .5}, 800, Phaser.Easing.Bounce.InOut,true, 100);
		var tweenC = game.add.tween(result_next_btn.scale).to({x: .5, y: .5}, 800, Phaser.Easing.Bounce.InOut,true, 200);
		game.add.tween(btn_bottom[2].scale).to({x: .5, y: .5}, 800, Phaser.Easing.Bounce.InOut,true, 200);
		var tweenD = game.add.tween(result_cc_btn.scale).to({x: .5, y: .5}, 800, Phaser.Easing.Bounce.InOut,true, 300);
		game.add.tween(btn_bottom[3].scale).to({x: .5, y: .5}, 800, Phaser.Easing.Bounce.InOut,true, 300);
		var tweenE = game.add.tween(result_rk_btn.scale).to({x: .5, y: .5}, 800, Phaser.Easing.Bounce.InOut,true, 400);
		game.add.tween(btn_bottom[4].scale).to({x: .5, y: .5}, 800, Phaser.Easing.Bounce.InOut,true, 400);
	} else {
		result_home_btn.position.setTo(game.world.centerX-53, game.height-120);
		btn_bottom[0].position.setTo(game.world.centerX-53, game.height-134);
		result_replay_btn.position.setTo(game.world.centerX+53, game.height-120);
		btn_bottom[1].position.setTo(game.world.centerX+53, game.height-134);
		result_cc_btn.position.setTo(game.world.centerX-40, game.height-49);
		btn_bottom[3].position.setTo(game.world.centerX-40, game.height-61);
		result_rk_btn.position.setTo(game.world.centerX+40, game.height-49);
		btn_bottom[4].position.setTo(game.world.centerX+40, game.height-61);
		var tweenA = game.add.tween(result_home_btn.scale).to({x: .5, y: .5}, 800, Phaser.Easing.Bounce.InOut,true);	
		game.add.tween(btn_bottom[0].scale).to({x: .5, y: .5}, 800, Phaser.Easing.Bounce.InOut,true);
		var tweenB = game.add.tween(result_replay_btn.scale).to({x: .5, y: .5}, 800, Phaser.Easing.Bounce.InOut,true, 200);
		game.add.tween(btn_bottom[1].scale).to({x: .5, y: .5}, 800, Phaser.Easing.Bounce.InOut,true, 200);
		var tweenD = game.add.tween(result_cc_btn.scale).to({x: .5, y: .5}, 800, Phaser.Easing.Bounce.InOut,true, 300);
		game.add.tween(btn_bottom[3].scale).to({x: .5, y: .5}, 800, Phaser.Easing.Bounce.InOut,true, 300);
		var tweenE = game.add.tween(result_rk_btn.scale).to({x: .5, y: .5}, 800, Phaser.Easing.Bounce.InOut,true, 400);
		game.add.tween(btn_bottom[4].scale).to({x: .5, y: .5}, 800, Phaser.Easing.Bounce.InOut,true, 400);
	}
	
}

function RANDOM_FALL() {
	f_chemie = game.add.emitter(game.world.centerX, -20, 250);
    f_chemie.makeParticles('all', f_arr);
    f_chemie.width = 100;
    f_chemie.minParticleSpeed.setTo(0, 400);
    f_chemie.maxParticleSpeed.setTo(0, 400);
    f_chemie.minParticleScale = .36;
    f_chemie.maxParticleScale = .45;
    f_chemie.setRotation(-90, 90);
    f_chemie.gravity = 400;
    f_chemie.start(false, 600, 100);
}

function BOX_FILL_FEW() {
	makeSprite(304.057/2, 602/2, few);
	makeSprite(373.703/2, 588/2, few);
	makeSprite(451.326/2, 602/2, few);
	makeSprite(342.8/2, 610/2, few);
	makeSprite(412/2, 612/2, few);
}

function BOX_FILL_HALF() {
	makeSprite(335.01/2, 550/2, half);
	makeSprite(385.4/2, 580/2, half);
	makeSprite(416.834/2, 546/2, half);
	var right = half.create(490/2, 578/2, 'all_chemies_ss', game.rnd.between(0, play_level-1));
	right.anchor.setTo(.5);
	right.scale.setTo(.54);
	right.angle = 30;
	var left = half.create(270/2, 600/2, 'all_chemies_ss', game.rnd.between(0, play_level-1));
	left.anchor.setTo(.5);
	left.scale.setTo(.54);
	left.angle = -40;
	makeSprite(303.188/2, 580/2, half);
	makeSprite(441.654/2, 584/2, half);
	makeSprite(412/2, 610/2, half);
	makeSprite(378.211/2, 590/2, half);
	makeSprite(344.547/2, 602/2, half);
}

function BOX_FILL_FULL() {
	makeSprite(364.355/2, 460/2, full);
	makeSprite(470.287/2, 490/2, full);
	makeSprite(424.651/2, 460/2, full);
	makeSprite(390.776/2, 472/2, full);
	makeSprite(313.768/2, 502/2, full);
	makeSprite(467.6/2, 534/2, full);
	makeSprite(250/2, 538/2, full);
	var right = full.create(518/2, 540/2, 'all_chemies_ss', game.rnd.between(0, play_level-1));
	right.anchor.setTo(.5);
	right.scale.setTo(.54);
	right.angle = 30;
	makeSprite(294.528/2, 480/2, full);
	makeSprite(266.684/2, 596/2, full);
	makeSprite(291.32/2, 536/2, full);
	makeSprite(373.604/2, 516/2, full);
	makeSprite(303.188/2, 574/2, full);
	makeSprite(390.776/2, 600/2, full);
	makeSprite(336.091/2, 536/2, full);
	makeSprite(416.497/2, 546/2, full);
	makeSprite(344.547/2, 600/2, full);
	makeSprite(441.654/2, 580/2, full);
	makeSprite(406.971/2, 630/2, full);
	var left = full.create(224/2, 574/2, 'all_chemies_ss', game.rnd.between(0, play_level-1));
	left.anchor.setTo(.5);
	left.scale.setTo(.45);
	left.angle = -40;
}

function makeSprite(pX, pY, box_size) {	
	var sprite = box_size.create(pX, pY, 'all_chemies_ss', game.rnd.between(0, play_level-1));
	sprite.anchor.setTo(.5);
	sprite.scale.setTo(game.rnd.between(36,38)/100);
	sprite.angle = game.rnd.angle();
}

function LAST2CHEMIES() {
	if (donePercent<80) {
		return;
	}
	var bounce, bounce2;
	if (play_level<7) {
		bounce = game.add.sprite(game.world.centerX, -30, chemies[play_level-1], 8);
		bounce.animations.add('wink', [0,1,2,3,4,5,6,7], 5, true);
		bounce.animations.play('wink');	
		bounce2 = game.add.sprite(-102, -85, chemies[play_level-1], game.rnd.between(0, 15));
	} else {
		bounce = game.add.sprite(game.world.centerX, -30, 'all_chemies_ss', play_level-1);
		bounce2 = game.add.sprite(-102, -87, 'all_chemies_ss', game.rnd.between(0, play_level-1));
	}	
	bounce.anchor.setTo(.5);
	bounce.scale.setTo(.4);
	
	bounce2.angle = -50;
	bounce2.anchor.setTo(.5);
	bounce2.scale.setTo(.7);
	bounce.addChild(bounce2);
	var bt = game.add.tween(bounce).to({y: 250}, 800, Phaser.Easing.Circular.In, true);
	
	var p0 = new Phaser.Point(game.world.centerX, 250);
    var p1 = new Phaser.Point(260, 60);   //375/2, 50
    var p2 = new Phaser.Point(297, 300);  //220, 20
    var p3 = new Phaser.Point(310, 458);   //310, 460
	bt.onComplete.add(function(){
		FALL_BURST();
	 	game.add.tween(bounce)
		.to({
            y: [p0.y, p1.y, p2.y, p3.y],
            x: [p0.x, p1.x, p2.x, p3.x]
        }, 1200, Phaser.Easing.Circular.None, true)	        
        .interpolation(function(v, k){
            return Phaser.Math.bezierInterpolation(v, k);
        });
	 	game.add.tween(bounce).to({angle: 30}, 200, Phaser.Easing.Exponential.InOut, true, 1000);
	 	var add_shadow = game.add.sprite(312,468, 'shadow');
	 	add_shadow.anchor.setTo(.5);
	 	add_shadow.scale.setTo(0);
	 	add_shadow.angle = -30;
	 	var add_shadow2 = game.add.sprite(298,420, 'shadow');
	 	add_shadow2.anchor.setTo(.5);
	 	add_shadow2.scale.setTo(1.4, 2.2);
	 	add_shadow2.alpha = 0;
	 	game.add.tween(add_shadow.scale).to({x:2, y:4}, 200, Phaser.Easing.Exponential.InOut,true, 1000);
	 	game.add.tween(add_shadow2).to({alpha: 1}, 200, Phaser.Easing.Exponential.InOut,true, 1000);
	 	bounce.bringToTop();
	 }, this); 
}

function FALL_BURST() {
	emitter2 = game.add.emitter(game.world.centerX, 220, 3);
	emitter2.width = 140;
	//emitter2.makeParticles(chemies[game.rnd.between(0, play_level-1)]);
	emitter2.makeParticles('all', f_arr);
	emitter2.minParticleSpeed.set(-300, -150);
    emitter2.maxParticleSpeed.set(300, -150);
    emitter2.setRotation(-90, 90);
	emitter2.setScale(.36, .36, 3000, Phaser.Easing.Exponential.InOut,false);
    emitter2.gravity = 300;
	emitter2.start(true, 2000, null, 5000);
}

function UNLOCKED() {
	setTimeout(FALL_BURST, 300);
	var unlockTween = game.add.tween(unlockChemie).to({y: 140}, 800, Phaser.Easing.Exponential.InOut, true);
	if (play_level<7) unlockChemie.animations.play('wink');
	game.add.tween(unlockChemie.scale).to({x: .9, y: .9}, 800, Phaser.Easing.Exponential.InOut, true);
	unlockTween.onComplete.add(function(){
		var spin = game.add.sprite(game.world.centerX, 140, 'spinObj_0'+game.rnd.between(1,8));
		BLING_BLING(game.world.centerX, 150, 'star2');
		spin.anchor.setTo(.5);
		spin.alpha = .6;
		game.add.tween(spin).to( {angle: 359}, 3000, Phaser.Easing.Linear.None, true,0,-1);
		unlockChemie.bringToTop();
		var twn = game.add.tween(unlockChemie.scale).to({x: 0, y: 0}, 500, Phaser.Easing.Exponential.InOut, true, 3000);
		game.add.tween(spin.scale).to({x: 0, y: 0}, 500, Phaser.Easing.Exponential.InOut, true, 1800);
		twn.onComplete.add(function(){
			BLING_BLING(game.world.centerX, 140, 'star2');
			showBtn();			
		}, this);
		
	}, this);
}

function BLING_BLING(x, y, key) {
	var burst = game.add.emitter(x, y, 8);
    burst.makeParticles(key);
    burst.setRotation(0, 90);
	burst.setAlpha(1, 0, 2000, Phaser.Easing.Exponential.InOut,false);
	var scale_max = key=='star2'? .2:1;
	burst.setScale(scale_max, 0, 2000, Phaser.Easing.Exponential.InOut,false);
	burst.start(true, 2500, null, 8);
}

function WINorLOSS() {
	
	//score = 100;
	f_arr = [];
	for (var i=0;i<play_level;i++) {
		f_arr[i]=i;
	}
	total_score = 0;
	counter = 0;
	done = 0;
	perCounter = 0;
	stop = false;
	levelComplete = 0;
	
	donePercent=Math.floor(score/phase3*100);
	if (donePercent>100) donePercent = 100;
	if (score>=goal) {
		levelComplete = true;
		if (play_level == curr_unlocked_level) {
			curr_unlocked_level++;
			localStorage.setItem("curr_unlocked_level", curr_unlocked_level);
		}
		if (score>=phase3) {
			level_bulbs_Arr[play_level-1]=3;
			if (play_level<7) {
				var arr = [chemies[play_level-1],play_level];
				unlocked_chemies_arr.push(arr);
			}
		} else if (score>=phase2) {
			if (level_bulbs_Arr[play_level-1]<2) level_bulbs_Arr[play_level-1]=2;			
		} else if (score>=phase1) {
			if (level_bulbs_Arr[play_level-1]<1) level_bulbs_Arr[play_level-1]=1;			
		}
		localStorage["level_bulbs_Arr"] = JSON.stringify(level_bulbs_Arr);
	}
	else {
		levelComplete = false;
	}

	console.log("SCORE: "+score);
	console.log("GOAL: "+goal);
	console.log("PERCENT: "+donePercent);
	console.log('WIN? ', levelComplete);
}
