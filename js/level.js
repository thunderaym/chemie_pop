var chemies=["H","He","Li","Be","B","C","N","O","F","Ne","Na","Mg","Al","Si","P","S","Cl","Ar","K","Ca"];
var names=["Hydrogen","Helium","Lithium","Beryllium","Boron","Carbon","Nitrogen","Oxygen","Fluorine","Neon","Sodium","Magnesium","Aluminium","Silicon","Phosphorus","Sulfur","Chlorine","Argon","Potassium","Potassium"];

var curr_unlocked_level = 1;
var play_level;
var levelTime = 20;
var levels;
var level_bulbs_Arr = [];
for (var i=0;i<20;i++) {
	level_bulbs_Arr[i] = 0;
}
var unlocked_chemies_arr = [];

var levelState = {
	create: function() {
		var background = game.add.sprite(0, 0, 'levelsBG');
		background.scale.setTo(.5);
		
		var hm_btn = game.add.button(330, 116.408/2, 'levels-home', buttonUp, this);
		hm_btn.scale.setTo(.5);
		hm_btn.anchor.setTo(.5);
		
		levels = game.add.group();
		unlocked_chemies_arr = [];
		
		GET_LEVEL();
		SET_LEVEL_BTN();
		CIRCLE_SHINE(levels.getAt(curr_unlocked_level-1).x, levels.getAt(curr_unlocked_level-1).y, levels.getAt(curr_unlocked_level-1).width/2);
		
	}
};

function GET_LEVEL() {
	if (localStorage.getItem("curr_unlocked_level")!= null) {
		curr_unlocked_level = localStorage.getItem("curr_unlocked_level")-'0';
	} else{
		localStorage.setItem("curr_unlocked_level", 1);
	}
	if (localStorage.getItem("level_bulbs_Arr")!= null) {
		level_bulbs_Arr = JSON.parse(localStorage["level_bulbs_Arr"]);
		//console.log(level_bulbs_Arr);
	} else {
		localStorage["level_bulbs_Arr"] = JSON.stringify(level_bulbs_Arr);
	}
	
}

function SET_LEVEL_BTN() {
	var pX, pY;
	//X: 147.056, 300.158, 453.259, 606.361
	//Y: 345.364, 547.662, 749.964, 953.579, 1156.318
	console.log(curr_unlocked_level);
	for (var i=0;i<5;i++) {
		if (i==0) {
			pY = 345.364/2;
		} else if (i==1) {
			pY = 547.662/2;
		} else if (i==2) {
			pY = 749.964/2;
		} else if (i==3) {
			pY = 953.579/2;
		} else {
			pY = 1156.318/2;
		}
		for (var j=0;j<4;j++) {
			if (j==0) {
				pX = 147.056/2;
			} else if (j==1) {
				pX = 300.158/2;
			} else if (j==2) {
				pX = 453.259/2;
			} else {
				pX = 606.361/2;
			}
			var btn_frame = 0;
			//var three_bulb_frame = -1;
			if (i*4+j>curr_unlocked_level-1) {
				btn_frame = 4;
			} else {
				btn_frame = level_bulbs_Arr[i*4+j];
				if (btn_frame==3 && i*4+j>0 && i*4+j<6) {
					var arr = [chemies[i*4+j],i*4+j+1];
					unlocked_chemies_arr.push(arr);
				}
			}
			//Phaser.Game.add.button(x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame, group)
			var level_btn = game.add.button(pX, pY, 'levels-btn', goToLevel, this, btn_frame, btn_frame, btn_frame, btn_frame, levels);
			level_btn.scale.setTo(.5);
			level_btn.anchor.setTo(.5);
			if (i*4+j<=curr_unlocked_level-1) {
				var level_num = game.add.text(0, -4, i*4+j+1, {font: "48px Nunito", fill: "#f7f7ea", boundsAlignH: "center", align: "center"});
				level_num.anchor.setTo(.5);
				level_btn.addChild(level_num);
				
				if (btn_frame>0) {
					var three_bulbs = game.add.sprite(pX, pY-32, '3-dot', btn_frame-1);
					three_bulbs.anchor.setTo(.5, 1);
					three_bulbs.scale.setTo(.5);
				}					
			}
			if (i*4+j==curr_unlocked_level-1) {
				var glow = game.add.sprite(pX, pY, 'glow_ring');
				glow.scale.setTo(.5);
				glow.anchor.setTo(.5);
				glow.alpha = .85;
				game.add.tween(glow).to({angle: 359}, 1000, Phaser.Easing.Linear.None, true, 0, -1);
				game.add.tween(glow).to({alpha: 0}, 1200, Phaser.Easing.Back.InOut, true, 0, -1, true);
			}
						
		}	
	}
}

function CIRCLE_SHINE(x, y, d) {
    var burst = game.add.emitter(x, y, 5);
    burst.makeParticles('star');
    burst.setRotation(0, 180);
	burst.setAlpha(1, 0, 2000, Phaser.Easing.Exponential.InOut, false);
	burst.setScale(.4, 0, 2000, Phaser.Easing.Exponential.InOut, false);
	burst.start(false, 300, 100);
	burst.emitX = x;
	burst.emitY = y-d;
	var tA = game.add.tween(burst).to( { emitX: x+d, emitY: y }, 800, Phaser.Easing.Back.InOut, true);
	var tB = game.add.tween(burst).to( { emitX: x, emitY: y+d }, 800, Phaser.Easing.Back.InOut, true);
	var tC = game.add.tween(burst).to( { emitX: x-d, emitY: y }, 800, Phaser.Easing.Back.InOut, true);
	var tD = game.add.tween(burst).to( { emitX: x, emitY: y-d }, 800, Phaser.Easing.Back.InOut, true);
	tA.chain(tB);
	tB.chain(tC);
	tC.chain(tD);
	tD.chain(tA);
}

function goToLevel(button) {
    //console.log('goToLevel', button.z);
    if (button.z >curr_unlocked_level) {
    	return;
    } else {
	    play_level = button.z;
    }
    var tweenA = game.add.tween(button.scale).to({x: 0.4, y: 0.4}, 200, Phaser.Easing.Exponential.InOut, true);
	var tweenB = game.add.tween(button.scale).to({x: .5, y: .5}, 200, Phaser.Easing.Exponential.InOut, true, 200);
    tweenA.chain(tweenB);
	setTimeout(function(){
		//console.log(unlocked_chemies_arr);
		game.state.start('info');	    
	}, 400);  
}

