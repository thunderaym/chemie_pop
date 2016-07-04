
var play_btn;
var collect_btn;
var rank_btn;
var prevState = 'title';
var ranking_borad;
var title_btns, result_btns;

var titleState = {
	
	create: function() {
		
		prevState = 'title';

		var background = game.add.sprite(0, 0,'titleBG');
		background.scale.setTo(.5);
		
		PROTON_DECO();
		
		play_btn = game.add.button(game.world.centerX, game.world.centerY+120, 'play_btn', buttonUp, this);
		play_btn.scale.setTo(.5);
		play_btn.anchor.setTo(.5);
	    
	    collect_btn = game.add.button(game.world.centerX-117, game.world.centerY+197, 'collect_btn', buttonUp, this);
	    collect_btn.scale.setTo(.5);
	    collect_btn.anchor.setTo(.5);
		
		rank_btn = game.add.button(game.world.centerX+117, game.world.centerY+197, 'rank_btn', buttonUp, this);
		rank_btn.scale.setTo(.5);
		rank_btn.anchor.setTo(.5);
		
		title_btns = game.add.group();
		title_btns.addMultiple([play_btn,collect_btn,rank_btn]);
						
	},
		
};

function PROTON_DECO() {
	var delay = 0;
	var pX = [300, 320, 80, 300];
	var pY = [435, 390, 136, 90];
	for (var i = 0; i < 4; i++) {		
		var proton = game.add.sprite(pX[i], pY[i], 'proton_ss', 0);		
        proton.scale.setTo(0);
        proton.anchor.setTo(0.5);
		proton.angle = game.rnd.angle();       		
		game.add.tween(proton.scale).to({
			x: 0.4,
			y: 0.4	
		}, 1000, Phaser.Easing.Exponential.InOut, true, delay);		
		delay += 200;
		BounceTween_noShadow(proton);
    }
}

function BounceTween_noShadow(obj) {
    var bounce=game.add.tween(obj);
    var x = game.rnd.integerInRange(-10,10);
    var y = game.rnd.integerInRange(-10,10);
    bounce.to({ x: obj.x + x, y: obj.y + y }, 1000, Phaser.Easing.Linear.InOut);
    bounce.to({ angle: game.rnd.angle() }, game.rnd.between(2000, 3500), Phaser.Easing.Back.InOut, false, 200);
    bounce.onComplete.add(BounceTween_noShadow, this);
    bounce.start();
}

function RANKING(btnSet) {
	btnSet.forEach(function(btn){
		btn.input.enabled = false;
	});
	rk_mask = game.add.sprite(0, 0, 'black-fade');
	rk_mask.alpha = 0;
	rk_mask.scale.setTo(.5);
	ranking_borad = game.add.sprite(418.774/2, -100, 'ranking_board');
	ranking_borad.anchor.setTo(.5, 1);
	ranking_borad.scale.setTo(.5);
	game.add.tween(rk_mask).to({alpha: .9},300,Phaser.Easing.Exponential.InOut, true);
	var tween = game.add.tween(ranking_borad).to({y: 1072/2},600,Phaser.Easing.Exponential.InOut, true);
	tween.onComplete.add(function(){
		ranking_borad.inputEnabled = true;
		ranking_borad.events.onInputDown.add(function(){
			game.add.tween(ranking_borad).to({y: -100},600,Phaser.Easing.Exponential.InOut, true, 100);
			btnSet.forEach(function(btn){
				btn.input.enabled = true;
			});
			game.add.tween(rk_mask).to({alpha: 0},300,Phaser.Easing.Exponential.InOut, true, 300);
		}, this);
	}, this);		
}

function buttonUp(button) {
    //console.log('button up', button.key);
    var tweenA = game.add.tween(button.scale).to({x: 0.4, y: 0.4}, 200, Phaser.Easing.Exponential.InOut, true);
	var tweenB = game.add.tween(button.scale).to({x: .5, y: .5}, 200, Phaser.Easing.Exponential.InOut, true, 200);
    tweenA.chain(tweenB);
	setTimeout(function(){
		if (button.key == 'play_btn') {
			game.state.start('level');
		} else if (button.key == 'collect_btn') {
	    	game.state.start('collect');
	    } else if (button.key == 'rank_btn') {
	    	RANKING(title_btns);
	    } else if(button.key == 'levels-home') {
	    	game.state.start('title');
	    } else if (button.key == 'collect_back_btn') {
	    	game.state.start(prevState);
	    } else if (button.key == 'collect_home_btn') {
	    	game.state.start('title');
	    } else if (button.key == 'result_cc_btn') {
			game.state.start('collect');
		} else if (button.key == 'result_rk_btn') {
			RANKING(result_btns);
		} else if (button.key == 'result_home_btn') {
			game.state.start('level');
		} else if (button.key == 'result_re_btn') {
			RESETGAME(play_level);
			game.state.start('play');
		} else if (button.key == 'result_next_btn') {
			RESETGAME(play_level+1);
			game.state.start('info');
		}
	}, 500);  
}
