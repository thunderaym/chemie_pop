
var customBounds = { left: null, right: null, top: null, bottom: null };

var box;
var card, skip_btn;
var levelNum, levelName, levelChemie;
var protons_info;
var bounds_info = new Phaser.Rectangle(100, 300, 175, 200);
var index_of_dragging_proton;
var protonLine_info = [];

var line_info;
var spring_info;
var springArr_info = [];
var protonLine_info = [];
var currTapText;
var connects_info=0;

var chemie_info, infoText, info_hand, info_hand_repeat=2;
var shadow;
var wait_for_user = false;

var emitter, manager;

var infoState = {
	
	create: function() {	

		var background = game.add.sprite(0, 0,'infoBG');
		background.scale.setTo(.5);
		
		game.physics.p2.gravity.y = 0;
		protons_info = game.add.physicsGroup(Phaser.Physics.P2JS);
		
		info_hand_repeat = 2;

		card = game.add.sprite(game.world.centerX, game.height,'infoCard'); // 667-134
		card.scale.setTo(.5);
		card.anchor.setTo(0.5, 0);
				
		levelTitle = game.add.text(game.world.centerX+6, 95, play_level, {font: '80px Signika Negative', fill: '#98676e', align: 'center'});
		levelTitle.alpha = 0;
		levelTitle.stroke = "#98676e";
		levelTitle.strokeThickness = 4;
		levelTitle.anchor.setTo(.5);
		game.add.tween(levelTitle).to({alpha: 1}, 1500, Phaser.Easing.Exponential.Out, true);
		
		skip_btn = game.add.sprite(320, 68, 'skip_btn');
		skip_btn.anchor.setTo(.5);
		skip_btn.scale.setTo(.5);
		skip_btn.inputEnabled = true;
		skip_btn.input.useHandCursor = true;
		skip_btn.events.onInputDown.add(function(){
			if (curr_unlocked_level==1) {
				localStorage.setItem("curr_unlocked_level", 2);
				curr_unlocked_level = 2;
				level_bulbs_Arr[0] = 3;
				localStorage["level_bulbs_Arr"] = JSON.stringify(level_bulbs_Arr);
				play_level = 2;
				game.state.start('info');
			} else {
				if (play_level==1) {
					play_level = 2;
					game.state.start('info');
				} else {
					RESETGAME(play_level);
					game.state.start('play');
				}
			}
		}, this);
		
		TUTORIAL_START();
		TUTORIAL_PROTONS();
		TUTORIAL_HINT();
		TUTORIAL_POP();
		
	}, 
	
	update: function() {		
		if (wait_for_user) protons_info.forEach(DRAGGING_OR_NOT_info, this, true);
	},
		
};

function firstTween() {
	var fadeIn = game.add.tween(levelChemie).to({alpha: 1},300, Phaser.Easing.Linear.Out);
	fadeIn.onComplete.add(secTween, this);
	fadeIn.start();
}
function secTween() {
	var fadeIn2 = game.add.tween(levelNum).to({alpha: 1},300, Phaser.Easing.Linear.Out);
	fadeIn2.onComplete.add(thirdTween, this);
	fadeIn2.start();	
}
function thirdTween() {
	var fadeIn3 = game.add.tween(levelName).to({alpha: 1},300, Phaser.Easing.Linear.Out);
	fadeIn3.start();
	
}

function TUTORIAL_START() {
	var info_message;
	if (play_level>1) {
		info_message = 'Drag and link\n'+play_level+' protons\nto pop '+names[play_level-1];
		infoText = game.add.text(game.world.centerX, game.height - 102, info_message, {font: "18px Muli", fill: "#98676e", align: "center"});
		infoText.addColor('#ea6880', 13);
		infoText.addColor('#98676e', 15);
		infoText.addColor('#ea6880', 29);
		infoText.lineSpacing = 0;
	} else {
		info_message = 'Tap 1 proton\nto pop Hydrogen';
		infoText = game.add.text(game.world.centerX, game.height - 90, info_message, {font: "18px Muli", fill: "#98676e", align: "center"});
		infoText.addColor('#ea6880', 4);
		infoText.addColor('#98676e', 6);
		infoText.addColor('#ea6880', 19);
	}	
	infoText.alpha = 0;	
	infoText.anchor.setTo(0.5, 0);
	infoText.setShadow(0, 2, 'rgba(108, 117, 118, 0.5)', 2);	
	
	var tweenA = game.add.tween(infoText).to({alpha: 1}, 1000, Phaser.Easing.Exponential.Out);
	var tweenB = game.add.tween(card).to({y: 533}, 1000, Phaser.Easing.Exponential.Out);
	tweenB.chain(tweenA);
	tweenB.start();

}

function TUTORIAL_PROTONS() {	
	createBounds(bounds_info.x, bounds_info.y, bounds_info.width, bounds_info.height);	
	currTapText = game.add.text(0, 0, '', {font: '28px Varela Round', fill: '#b0bf6b'});
	currTapText.anchor.setTo(0,1);
    currTapText.stroke = '#c9d390';
    currTapText.strokeThickness = 2;
	currTapText.visible = false;
	
	var delay = 0;
	var posX, posY;
	for (var i = 0; i < play_level; i++) {
		if (play_level==1) {
			posX = game.world.centerX;
			posY = game.world.centerY+50;
		} else {
			posX = bounds_info.randomX;
			posY = bounds_info.randomY;
		}
		var proton = protons_info.create(posX, posY, 'proton_ss', 0);
        proton.scale.setTo(0);
        proton.body.setCircle(25);
		proton.body.angle = game.rnd.integerInRange(0, 359);
        game.physics.enable(proton, Phaser.Physics.P2JS);
        proton.belinked = false;
        proton.inline = false;
         
        proton.inputEnabled = true;
        proton.input.enableDrag();
        proton.input.boundsRect = bounds_info;
        
        proton.events.onDragStart.add(startDrag_info, this);
		proton.events.onDragStop.add(stopDrag_info, this);
		
		game.add.tween(proton.scale).to({
			x: 0.6,
			y: 0.6	
		}, 1000, Phaser.Easing.Exponential.InOut, true, delay);		
		delay += 200;			
    }
}

function TUTORIAL_HINT() {
	info_hand = game.add.sprite(game.world.width+100, game.world.centerY+150, 'info_hand');
    info_hand.scale.setTo(.4);
    info_hand.alpha = 0;
    info_hand.anchor.setTo(.5, 0);
	
	var p0 = new Phaser.Point(260, 430);
	var p1 = new Phaser.Point(168, 486);   
	var p2 = new Phaser.Point(43, 389);  
	var p3 = new Phaser.Point(128, 340);
	var p4 = new Phaser.Point(233, 279);
	var p5 = new Phaser.Point(351, 375);     
		
	if (play_level == 1) {		
		for (var i=0;i<2;i++) {
			var tween1 = game.add.tween(info_hand);
			tween1.to({x: game.world.centerX+8, y: game.world.centerY+35, alpha: 1}, 1500, Phaser.Easing.Exponential.InOut, true, 1000, 0);
			var tween2 = game.add.tween(info_hand.scale).to({x: .35, y: .35}, 300, Phaser.Easing.Exponential.InOut, false, 0, 0, true);
			var t = tween1.chain(tween2);			
			var tween3 = game.add.tween(info_hand).to({alpha: 0}, 500, Phaser.Easing.Exponential.InOut, true, 3000);			
		}
	} else {
		REPEAT();		   
	}	
}

function REPEAT() {	
	if (info_hand_repeat-- >0) {
		game.add.tween(info_hand).to({alpha: 1}, 500, Phaser.Easing.Linear.InOut, true);
		var p0 = new Phaser.Point(260, 430);
		var p1 = new Phaser.Point(168, 486);   
		var p2 = new Phaser.Point(43, 389);  
		var p3 = new Phaser.Point(128, 340);
		var p4 = new Phaser.Point(233, 279);
		var p5 = new Phaser.Point(351, 375); 
		var tweenA = game.add.tween(info_hand).to({
	            y: [p0.y, p1.y, p2.y, p3.y],
	            x: [p0.x, p1.x, p2.x, p3.x]
	        }, 500, Phaser.Easing.Exponential.None, true, 800)	        
	        .interpolation(function(v, k){
	            return Phaser.Math.bezierInterpolation(v, k);
	        });
	    tweenA.onComplete.add(function(){
		   	var t = game.add.tween(info_hand).to({
	            y: [p3.y, p4.y, p5.y, p0.y],
	            x: [p3.x, p4.x, p5.x, p0.x],
	            alpha: 0.25
	        }, 800, Phaser.Easing.Exponential.Out, true)	        
	        .interpolation(function(v, k){
	            return Phaser.Math.bezierInterpolation(v, k);
	        });
	        t.onComplete.addOnce(REPEAT, this);
	    }, this);
	} else {
		game.add.tween(info_hand).to({alpha: 0}, 200, Phaser.Easing.Linear.InOut, true);
	}
}

function TUTORIAL_POP() {
	setTimeout(function() {
		wait_for_user = true;
	}, 2000);
}

function TUTORIAL_MESSAGE() {
	levelChemie = game.add.text(game.world.centerX, game.height - 102, chemies[play_level-1], {font: '22px Varela Round', fill: '#ea6880', align: 'center'});
	levelChemie.alpha = 0;
	levelChemie.anchor.setTo(.5, 0);
	levelChemie.setShadow(0, 2, 'rgba(108, 117, 118, 0.5)', 2);
	
	levelNum = game.add.text(game.world.centerX, game.height - 66, 'Atomic Number: '+(play_level), {font: '16px Muli', fill: '#98676e', align: 'center'});
	levelNum.alpha = 0;
	levelNum.anchor.setTo(.5, 0);
	
	levelName = game.add.text(game.world.centerX, game.height - 40, 'Name: '+ names[play_level-1], {font: '16px Muli', fill: '#98676e', align: 'center'});
	levelName.alpha = 0;
	levelName.anchor.setTo(.5, 0);
		
	game.add.tween(infoText).to({alpha: 0}, 1000, Phaser.Easing.Exponential.Out, true);
	firstTween();
}

function startDrag_info(pt, pointer) {
	pt.body.moves = false;		
	pt.body.setZeroVelocity();			
}

function stopDrag_info(pt) {
	pt.body.moves = true;
	
	var tweenAs = game.add.tween(card.scale);
	var tweenAp = game.add.tween(card);
	
	if (connects_info==play_level) {	
		if (play_level<7 && play_level>1) {
			chemie_info = game.add.sprite(game.input.activePointer.worldX, game.input.activePointer.worldY, chemies[play_level-1], 0);
			chemie_info.animations.add('wink',[0,1,2,3,4,5,6,7],7,true);
			chemie_info.animations.play('wink');
		} else {
			chemie_info = game.add.sprite(game.input.activePointer.worldX, game.input.activePointer.worldY, 'all_chemies_ss', play_level-1);
		}
		chemie_info.scale.setTo(0);
		chemie_info.anchor.setTo(.5);
		info_hand.visible = false;		
		var tween = game.add.tween(chemie_info).to({alpha: 1, x: game.world.centerX, y: game.world.centerY+20}, 500, Phaser.Easing.Exponential.InOut, true);
		tween = game.add.tween(chemie_info.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Exponential.InOut, true);
		tween.onComplete.add(function(){
			shadow = game.add.sprite(game.world.centerX, game.world.centerY+120, 'shadow');
			shadow.anchor.setTo(.5);
			
			emitter = game.add.emitter(game.world.centerX, game.world.centerY+60, 8);
		    emitter.makeParticles('spark');
		    emitter.setRotation(0, 90);
			emitter.setAlpha(1, 0, 2000, Phaser.Easing.Exponential.InOut,false);
			emitter.setScale(1.35, 0, 2000, Phaser.Easing.Exponential.InOut,false);
			emitter.gravity = 0.05;
			emitter.start(true, 2000, null, 8);
			BounceTween(chemie_info);
			TUTORIAL_MESSAGE();			
		}, this);
		tween.start();
		protons_info.forEach(function(pt) {
			pt.kill();
		}, this, true);
		release_info(true);		
	} else {
		if (wait_for_user) {
			if (card.scale.x<=.5 && !tweenAs.isRunning) {
				tweenAp.to({y: card.y-60}, 500, Phaser.Easing.Exponential.Out, true);
				tweenAs.to({x: .6, y: .8}, 500, Phaser.Easing.Exponential.Out, true);		
				var tweenBs = game.add.tween(infoText.scale);
				var tweenBp = game.add.tween(infoText);
				tweenBp.to({y: infoText.y-40}, 500, Phaser.Easing.Exponential.Out, true);
				tweenBs.to({x: 1.35, y: 1.35}, 500, Phaser.Easing.Exponential.Out, true);
				
				game.add.tween(card).to({y: 533}, 800, Phaser.Easing.Exponential.Out, true, 1000);
				game.add.tween(card.scale).to({x: .5, y: .5}, 800, Phaser.Easing.Exponential.Out, true, 1000);
				game.add.tween(infoText).to({y: game.height - 102}, 800, Phaser.Easing.Exponential.Out, true, 1000);
				game.add.tween(infoText.scale).to({x: 1, y: 1}, 800, Phaser.Easing.Exponential.Out, true, 1000);
			}									
			release_info(false);
		}
	}
}

function release_info(gotoplay) {
	protons_info.forEach(RESET_PROTON_TAG_info, this, true);
	var spring;
	while (spring = game.physics.p2.world.springs.pop()) {
        game.physics.p2.onSpringRemoved.dispatch(spring);
	}	
	springArr_info = [];
	connects_info = 0;
	currTapText.visible = false;
	
	if (gotoplay) {
		if (play_level==1) {
			//console.log('Play Tutoral 2');
			setTimeout(function(){
				if (curr_unlocked_level==1) {
					localStorage.setItem("curr_unlocked_level", 2);
					curr_unlocked_level = 2;
					level_bulbs_Arr[0] = 3;
					localStorage["level_bulbs_Arr"] = JSON.stringify(level_bulbs_Arr);
				}
				play_level = 2;
				game.state.start('info');
			}, 3000);
		} else {
			toPlay();
		}		
	}
}

function RESET_PROTON_TAG_info(pt) {
	pt.body.static = false;
	
	if (pt.belinked) {
		pt.belinked = false;
	}
	if (pt.inline) {
		pt.inline = false;
	}

}

function DRAGGING_OR_NOT_info(pt) {	
	if( pt.input.isDragged ){	
		if( pt.body != null){
			pt.body.x = game.input.activePointer.worldX;
			pt.body.y = game.input.activePointer.worldY;
			pt.belinked = true;			
			if (!pt.inline) {
				protonLine_info.push(pt);
				pt.inline = true;				
			}
			index_of_dragging_proton = pt.z;
			protons_info.forEach(PROTON_LINK_info, this, true);
			connects_info = 1;
			protons_info.forEach(LINES_info, this, true);			
		}
	}			
}

function PROTON_LINK_info(pt) {
	if (pt.z!=index_of_dragging_proton) {		
		var distanceX = Math.abs(pt.body.x - game.input.activePointer.worldX);
		var distanceY = Math.abs(pt.body.y - game.input.activePointer.worldY);	
		if (distanceX<pt.width && distanceY <pt.height) {
			pt.body.setZeroVelocity();
			pt.belinked = true;
			pt.body.moves = false;
		}	
	}	
}

function LINES_info(pt) {	
	if (pt.belinked && pt.z!=index_of_dragging_proton) {
		if (!pt.inline) {
			pt.body.setZeroVelocity();
			pt.body.moves = false;
			protonLine_info.push(pt);			
			spring_info = game.physics.p2.createSpring(protonLine_info[protonLine_info.length-2], pt, 0, 50, 2);		
			springArr_info.push(spring_info);
			pt.inline = true;
		}		
		connects_info ++;
		if (connects_info>1) {			
			currTapText.text = (connects_info);// + " Protons";
			currTapText.x = game.input.activePointer.worldX+25;
			currTapText.y = game.input.activePointer.worldY;
			currTapText.visible = true;
		}
		
	}
	
}


function BounceTween(obj) {
    var bounce=game.add.tween(obj);
    var x = game.rnd.integerInRange(-8,8);
    var y = game.rnd.integerInRange(-8,8);
    bounce.to({ x: obj.x + x, y: obj.y + y }, 1000, Phaser.Easing.Linear.InOut);
    var bounce2=game.add.tween(shadow);
    bounce2.to({ x: obj.x + x, y: obj.y + y + 120 }, 1000, Phaser.Easing.Linear.InOut, true);
    bounce.onComplete.add(BounceTween, this);
    bounce.start();
}


function toPlay() {
	RESETGAME(play_level);
	setTimeout(function(){
		levelTime = 20+Math.floor(play_level/5)*5;
		game.state.start('play');
	}, 4000);
}


