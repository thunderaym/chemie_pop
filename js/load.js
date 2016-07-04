
var loadState = {
	
	preload: function() {	
						
		var loadingBG = game.add.sprite(0,0,'loadBG');
		loadingBG.scale.setTo(.5);
		
		var loadingLabel = game.add.text(game.world.centerX+6, game.world.centerY+65, 'Loading...', {font: "20px Varela Round", fill: "rgba(255,255,255,1)"});
		loadingLabel.anchor.setTo(.5);
		
		game.load.spritesheet('proton_ll', 'assets/proton-100x95.png', 100, 95);		
	    game.load.spritesheet('proton_ss', 'assets/proton-76x72.png', 76, 72);
	    
	    //Title State
	    game.load.image('titleBG', 'assets/bg/bg-title.png');
	    game.load.image('play_btn','assets/buttons/title_play_btn.png');
	    game.load.image('collect_btn','assets/buttons/title_collect_btn.png');
		game.load.image('rank_btn','assets/buttons/title_rank_btn.png');
	    
	    //Level State
	    game.load.image('levelsBG', 'assets/bg/bg-levels2.png');
	    game.load.image('levels-home', 'assets/buttons/level_home_btn.png');
	    game.load.spritesheet('levels-btn', 'assets/level/level_btns-108x118.png', 108, 118);
	    game.load.spritesheet('3-dot', 'assets/level/level_mark_dot-92x38.png', 92, 38);
	    
	    //Instruction State
	    game.load.image('infoBG', 'assets/bg/bg-info.png');
	    game.load.image('infoCard', 'assets/infoCard.png');
	    game.load.image('shadow', 'assets/effect/shadow.png');
	    game.load.image('info_hand', 'assets/info_hand.png');
	    game.load.image('skip_btn', 'assets/buttons/skip_btn.png');
	    game.load.image('tutorial_board', 'assets/tutorial/tutorial_board.png');
	    game.load.image('tutorial_s1', 'assets/tutorial/s1.png');
	    game.load.image('tutorial_s2', 'assets/tutorial/s2.png');
	    game.load.image('tutorial_s3', 'assets/tutorial/s3.png');
	    game.load.image('x_btn', 'assets/buttons/x_btn.png');
	    game.load.spritesheet('tutorial_btns', 'assets/buttons/tutorial_btns-204x90-23-23.png', 204, 90);	    
	    
	    //Game State
	    game.load.image('gameBG', 'assets/bg/02.png');
	    game.load.image('machineTop', 'assets/machineTop.png');
	    game.load.spritesheet('score_bar', 'assets/phases-750x1334.png', 750, 1334);
	    game.load.image('goalBoard', 'assets/goal_board.png');
	    game.load.image('booster_btm', 'assets/buttons/booster_btm.png');
	    game.load.spritesheet('booster_btns', 'assets/buttons/booster_btns-76x64.png', 76, 64);
	    game.load.spritesheet('pause-screen-btns', 'assets/buttons/pause_screen_btns-250x92.png', 250, 92);
	    game.load.image('pause-btn', 'assets/buttons/pause_btn.png');
	    game.load.image('tube', 'assets/chemieTube.png');
	    game.load.spritesheet('hint_btn', 'assets/buttons/hint_btn-94x50.png', 94, 50);
	    
	    //Effect Pieces
	    game.load.image('spark', 'assets/effect/spark.png');
	    game.load.image('star', 'assets/effect/star_particle.png');
	    game.load.image('star2', 'assets/effect/star2.png');
	    game.load.image('glow_ring', 'assets/effect/glow-ring.png');
	    game.load.image('halo', 'assets/effect/halo2.png');
	    game.load.image('black-fade', 'assets/mask.png');
	    game.load.image('pt_pieces', 'assets/effect/pt_pieces.png');
		    	    	    
	    //chemies
		game.load.image('H', 'assets/chemies/atoms_ss-01.png');
		game.load.spritesheet('He', 'assets/chemies/atoms_ss-02.png', 104, 122);
		game.load.spritesheet('Li', 'assets/chemies/atoms_ss-003.png', 124, 136);
		game.load.spritesheet('Be', 'assets/chemies/atoms_ss-04_114x132.png', 114, 132);
		game.load.spritesheet('B', 'assets/chemies/atoms_ss-05.png', 104, 122);
		game.load.spritesheet('C', 'assets/chemies/atoms_ss-06.png', 126, 132);
		game.load.spritesheet('all', 'assets/chemies/atoms_ss-00.png', 122, 136);
		game.load.spritesheet('all_chemies_ss', 'assets/chemies/all_chemies_ss.png', 122, 136);
		game.load.image('locked_chemie', 'assets/chemies/locked-chemie.png');
	    	    
	    //Result State
	    game.load.image('resultBG', 'assets/bg/bg-result.jpg');
	    game.load.image('complete-bulb-l', 'assets/result/complete-bulb-off-l.png');
	    game.load.image('complete-bulb-m', 'assets/result/complete-bulb-off-m.png');
	    game.load.image('complete-bulb-r', 'assets/result/complete-bulb-off-r.png');
	    game.load.image('complete-bulb-on-0', 'assets/result/complete-bulb-on-0.png');
	    game.load.image('complete-bulb-on-1', 'assets/result/complete-bulb-on-1.png');
	    game.load.image('complete-bulb-on-2', 'assets/result/complete-bulb-on-2.png');
	    game.load.image('result_board', 'assets/result/result_board.png');
	    game.load.image('result_completed', 'assets/result/result_completed.png');
	    game.load.image('result_failed', 'assets/result/result_failed.png');
	    game.load.image('result_level', 'assets/result/result_level.png');
	    
	    game.load.spritesheet('flash_bulb_1', 'assets/result/flash_b_1-84x100.png', 84, 100);
	    game.load.spritesheet('flash_bulb_2', 'assets/result/flash_b_2-100x100.png', 100, 100);
	    game.load.spritesheet('flash_bulb_3', 'assets/result/flash_b_3-84x100.png', 84, 100);
	    game.load.image('result_btnBtm_l', 'assets/result/result_btn_btm_l.png');
	    game.load.image('result_btnBtm_s', 'assets/result/result_btn_btm_s.png');
	    game.load.image('result_home_btn', 'assets/result/result_home_btn.png');
	    game.load.image('result_next_btn', 'assets/result/result_next_btn.png');
	    game.load.image('result_re_btn', 'assets/result/result_replay_btn.png');
	    game.load.image('result_rk_btn', 'assets/result/result_rk_btn.png');
	    game.load.image('result_cc_btn', 'assets/result/result_cc_btn.png');
	    game.load.image('popcornBox_back', 'assets/result/popcornBucket_back.png');
	    game.load.image('popcornBox_front', 'assets/result/popcornBucket_front.png');
	    
	    game.load.image('spinObj_01', 'assets/effect/spinObj_01.png');
	    game.load.image('spinObj_02', 'assets/effect/spinObj_02.png');
	    game.load.image('spinObj_03', 'assets/effect/spinObj_03.png');
	    game.load.image('spinObj_04', 'assets/effect/spinObj_04.png');
	    game.load.image('spinObj_05', 'assets/effect/spinObj_05.png');
	    game.load.image('spinObj_06', 'assets/effect/spinObj_06.png');
	    game.load.image('spinObj_07', 'assets/effect/spinObj_07.png');
	    game.load.image('spinObj_08', 'assets/effect/spinObj_08.png');
	    
	    //Collect State
	    game.load.image('collectBG', 'assets/bg/01.png');
	    game.load.image('c_page0', 'assets/collect/c_page_0.png');
	    game.load.image('c_page1', 'assets/collect/c_page_1.png');
	    game.load.image('c_page2', 'assets/collect/c_page_2.png');
	    game.load.image('c_page3', 'assets/collect/c_page_3.png');
	    game.load.image('collect_back_btn', 'assets/buttons/back_btn.png');
	    game.load.image('collect_home_btn', 'assets/buttons/collect_home_btn.png');
	    game.load.spritesheet('boxes_ss', 'assets/collect/boxes_ss.png', 112, 206);
		game.load.image('paginate0', 'assets/collect/paginate0.png');
		game.load.image('paginate1', 'assets/collect/paginate1.png');
		game.load.image('paginate2', 'assets/collect/paginate2.png');
		game.load.image('paginate3', 'assets/collect/paginate3.png');
		game.load.image('page_arrow', 'assets/collect/page_arrow.png');
		game.load.image('ok_btn', 'assets/buttons/ok_btn.png');
		game.load.image('detail_board', 'assets/collect/detail_board.png');
		game.load.image('c_top', 'assets/collect/machineTop_blue.png');
		game.load.image('detail_1', 'assets/collect/detail/1.png');
		game.load.image('detail_2', 'assets/collect/detail/2.png');
		game.load.image('detail_3', 'assets/collect/detail/3.png');
		game.load.image('detail_4', 'assets/collect/detail/4.png');
		game.load.image('detail_5', 'assets/collect/detail/5.png');
		game.load.image('detail_6', 'assets/collect/detail/6.png');
		game.load.image('detail_7', 'assets/collect/detail/7.png');
		game.load.image('detail_8', 'assets/collect/detail/8.png');
		game.load.image('detail_9', 'assets/collect/detail/9.png');
		game.load.image('detail_10', 'assets/collect/detail/10.png');
		game.load.image('detail_11', 'assets/collect/detail/11.png');
		game.load.image('detail_12', 'assets/collect/detail/12.png');
		game.load.image('detail_13', 'assets/collect/detail/13.png');
		game.load.image('detail_14', 'assets/collect/detail/14.png');
		game.load.image('detail_15', 'assets/collect/detail/15.png');
		game.load.image('detail_16', 'assets/collect/detail/16.png');
		game.load.image('detail_17', 'assets/collect/detail/17.png');
		game.load.image('detail_18', 'assets/collect/detail/18.png');
		game.load.image('detail_19', 'assets/collect/detail/19.png');
		game.load.image('detail_20', 'assets/collect/detail/20.png');
		
		//Ranking
		game.load.image('ranking_board', 'assets/ranking_board.png');
		
	},
		
	create: function() {
		
		setTimeout(function() {game.state.start('title')}, 1000);
	}	
	
};