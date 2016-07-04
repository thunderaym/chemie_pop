
var c_pages, arrow_right, arrow_left;
var paginate = [];
var curr_page_index = 0;
var c_back_btn, c_home_btn, eType;
var typeStyle = {font: "26px Oduda", fill: "#a54d4b", boundsAlignH: "center", align: "center"};
var c_popup, c_mask, c_detail;
var chemieBoxes, box_symbols, box_atomicNums;
var hasBox = [];
for (var i=0;i<4;i++) {
	hasBox[i] = [];
	for (var j=0;j<6;j++) {
		hasBox[i][j]=1;	
	}
}
var symbol_by_type_arr = [['H','C','N','O','P','S'], ['','He','F','Ne','Cl','Ar'], ['B','','Al','Si','',''], ['Li','Be','Na','Mg','K','Ca']];
var atomicNum_by_type_arr = [[1,6,7,8,15,16], [0,2,9,10,17,18], [5,0,13,14,0,0], [3,4,11,12,19,20]];

var startX, startY, endX, endY;


console.log("prevState: ", prevState);

var collectState = {
	create: function() {
		
		game.add.sprite(0, 0, 'collectBG');
		
		curr_page_index = 0;
		
		c_pages = game.add.group();
		
		for (var i=0;i<4;i++) {
			var p = c_pages.create(game.width*i, 0, 'c_page'+i);
			p.scale.setTo(.5);
			paginate[i] = game.add.sprite(game.world.centerX, game.height-21, 'paginate'+i);
			paginate[i].scale.setTo(.5);
			paginate[i].anchor.setTo(.5);
			paginate[i].alpha = 0;
		}
		paginate[0].alpha = 1;
				
		//124.111, 147.687   625.178, 147.687
		c_back_btn = game.add.button(63, 76, 'collect_back_btn', buttonUp, this);
		c_home_btn = game.add.button(313, 76, 'collect_home_btn', buttonUp, this);
		c_home_btn.scale.setTo(.5);
		c_home_btn.anchor.setTo(.5);
		c_home_btn.input.priorityID = 1;
		c_back_btn.scale.setTo(.5);
		c_back_btn.anchor.setTo(.5);
		c_back_btn.input.priorityID = 1;
		
		eType = game.add.text(game.world.centerX, 66, 'Nonmetal', typeStyle);
		eType.setShadow(0, 0, 'rgba(108,107,118,0.5)', 4);
		eType.anchor.setTo(.5);

		SET_BOXES();		
		SHOW_BOXES();
		
		//game.input.onDown.add(beginSwipe, this);
		//game.input.priorityID = 2;
		
		arrow_left = game.add.sprite(54.897/2, game.world.centerY, 'page_arrow');
		arrow_left.anchor.setTo(.5);
		arrow_left.scale.setTo(.5);
		arrow_left.angle = -180;
		arrow_left.inputEnabled = true;
		arrow_right = game.add.sprite(695.103/2, game.world.centerY, 'page_arrow');
		arrow_right.anchor.setTo(.5);
		arrow_right.scale.setTo(.5);
		arrow_right.inputEnabled = true;
		
		arrow_left.events.onInputDown.add(PREV_PAGE, this);
		arrow_left.visible = 0;
		arrow_right.events.onInputDown.add(NEXT_PAGE, this);
		
		//popup screen
		c_mask = game.add.sprite(0, 0, 'black-fade');
		c_mask.alpha = 0;
		c_mask.scale.setTo(.5);
		c_popup = game.add.sprite(game.world.centerX, -100, 'detail_board');
		c_popup.anchor.setTo(.5, 1);
		c_popup.scale.setTo(.5);
		
	}

};

function SET_BOXES() {
	
	GET_LEVEL();

	hasBox[1][0]=0;
	hasBox[2][1]=0;
	hasBox[2][4]=0;
	hasBox[2][5]=0;
	
	chemieBoxes = game.add.group();
	box_symbols = game.add.group();
	box_atomicNums = game.add.group();
	
	for (var j=0;j<6;j++) {		
		var posX, posY;
		//X: 281.355, 468.645  j%2==0 -> 140.68, j%2==1 -> 234.32
		//Y: 448.512, 772.667, 1091.737   j/2<1 -> 224.26, j/2<2 -> 386.33, j/2<3 -> 545.87
		if (j%2) {
			posX = 234.32;
		} else {
			posX = 140.68;
		}
		if (j/2<1) {
			posY = 224.26;
		} else if (j/2<2) {
			posY = 386.33;
		} else {
			posY = 545.87;
		}
		var lockedBox = chemieBoxes.create(posX, posY, 'boxes_ss', 0);
		lockedBox.scale.setTo(.5);
		lockedBox.anchor.setTo(.5);

		//X1: 282.653, 469.942
		//Y1: 404.678, 728.833, 1047.903
		//X2: 266.867, 454.157
		//Y2: 481.263, 805.419, 1124.488		
		if (j%2) { 
			posX1 = 234.97;
			posX2 = 227;
		} else {
			posX1 = 141.33;
			posX2 = 133;
		}
		if (j/2<1) {
			posY1 = 201;
			posY2 = 242;
		} else if (j/2<2) {
			posY1 = 363;
			posY2 = 404;
		} else {
			posY1 = 522;
			posY2 = 564;
		}
		var symbol = game.add.text(posX1, posY1, symbol_by_type_arr[curr_page_index][j], { font: "20px Nunito", fill: "#98676e", boundsAlignH: "center", boundsAlignV: "middle" }, box_symbols);
		symbol.anchor.setTo(.5);
		var atomicNum = game.add.text(posX2, posY2, atomicNum_by_type_arr[curr_page_index][j], { font: "11px Nunito", fill: "#98676e", boundsAlignH: "center", boundsAlignV: "middle" }, box_atomicNums);
		atomicNum.anchor.setTo(.5);

	}
}

function SHOW_BOXES() {
	for (var j=0;j<6;j++) {		
		var posX1, posY1, posX2,posX2; 
		var lockedBox = chemieBoxes.getAt(j);
		var box_symbol = box_symbols.getAt(j);
		var box_atomicNum = box_atomicNums.getAt(j);
		if (hasBox[curr_page_index][j]) {
			if (atomicNum_by_type_arr[curr_page_index][j]<curr_unlocked_level) {
				lockedBox.frame = (atomicNum_by_type_arr[curr_page_index][j]>6)? 7:atomicNum_by_type_arr[curr_page_index][j];
				if (atomicNum_by_type_arr[curr_page_index][j]>6) {
					lockedBox.frame = 7;
					box_symbol.text = symbol_by_type_arr[curr_page_index][j];
					box_symbol.alpha = 1;
					box_atomicNum.text = atomicNum_by_type_arr[curr_page_index][j];
					box_atomicNum.alpha = 1;
				} else {
					box_symbol.alpha = 0;
					box_atomicNum.alpha = 0;
				}
			} else {
				if (atomicNum_by_type_arr[curr_page_index][j]==curr_unlocked_level && level_bulbs_Arr[curr_unlocked_level-1]>0) {
					lockedBox.frame = (atomicNum_by_type_arr[curr_page_index][j]>6)? 7:atomicNum_by_type_arr[curr_page_index][j];
					if (atomicNum_by_type_arr[curr_page_index][j]>6) {
						lockedBox.frame = 7;
						box_symbol.text = symbol_by_type_arr[curr_page_index][j];
						box_symbol.alpha = 1;
						box_atomicNum.text = atomicNum_by_type_arr[curr_page_index][j];
						box_atomicNum.alpha = 1;
					} else {
						box_symbol.alpha = 0;
						box_atomicNum.alpha = 0;
					}					
				} else {
					lockedBox.frame = 0;
					box_symbol.text = symbol_by_type_arr[curr_page_index][j];
					box_symbol.alpha = 1;
					box_atomicNum.text = atomicNum_by_type_arr[curr_page_index][j];
					box_atomicNum.alpha = 1;
				}				
			}
			lockedBox.alpha = 1;
			lockedBox.inputEnabled = true;
	        lockedBox.events.onInputUp.add(COLLECTION_POPUP, this);	
		} else {
			lockedBox.alpha = 0;
			box_symbol.alpha = 0;
			box_atomicNum.alpha = 0;
		}
		lockedBox.atomicID = atomicNum_by_type_arr[curr_page_index][j];
	}
}

function COLLECTION_POPUP(e) {
	tweenM = game.add.tween(c_mask).to({alpha: .9},500,Phaser.Easing.Exponential.InOut,true);
	var tween = game.add.tween(c_popup).to({y: 1167/2},1000,Phaser.Easing.Exponential.InOut,true);
	var chemie;
	if (e.atomicID<curr_unlocked_level) {
		if (e.atomicID<7 && e.atomicID>1) {
			chemie = game.add.sprite(0, -800, chemies[e.atomicID-1]);
			chemie.animations.add('anime',[8,9,10,11,12,13,14,15],7,true);
			chemie.animations.play('anime');
		} else {
			chemie = game.add.sprite(0, -800, 'all_chemies_ss', e.atomicID-1);
		}
	} else {
		chemie = game.add.sprite(1, -800, 'locked_chemie');
		var symbol = game.add.text(0, -32, chemies[e.atomicID-1], { font: "20px Varela Round", fill: "#98676e", boundsAlignH: "center", boundsAlignV: "middle" });
		symbol.anchor.setTo(.5);
		var pNum = game.add.text(2, 40, e.atomicID, { font: "16px Varela Round", fill: "#98676e", boundsAlignH: "center", boundsAlignV: "middle" });
		pNum.anchor.setTo(.5);
		chemie.addChild(symbol);
		chemie.addChild(pNum);
	}
	
	chemie.scale.setTo(0);
	chemie.anchor.setTo(.5);
	c_popup.addChild(chemie);
	game.add.tween(chemie.scale).to({x: 1.7, y: 1.7},500,Phaser.Easing.Exponential.InOut,true,800);
	
	c_detail = game.add.sprite(0, -636, 'detail_'+e.atomicID);
	c_detail.anchor.setTo(.5,0);
	c_detail.alpha=0;
	c_popup.addChild(c_detail);

	tween.onComplete.add(function(){			
		game.add.tween(c_detail).to({alpha: 1},500,Phaser.Easing.Exponential.Out,true);
		var closeButton = game.make.sprite(0, -133 , 'ok_btn');
		c_popup.addChild(closeButton);
		closeButton.anchor.setTo(.5);
		closeButton.inputEnabled = true;
	    closeButton.events.onInputDown.add(function(){
	    	var t1 = game.add.tween(closeButton.scale).to({x: .8, y: .8}, 200, Phaser.Easing.Exponential.Out, true, 0, 0, true);
	    	t1.onComplete.add(function(){
		    	game.add.tween(c_popup).to( { y: -100 }, 500, Phaser.Easing.Exponential.Out, true);
		    	game.add.tween(c_mask).to( { alpha: 0 }, 300, Phaser.Easing.Exponential.Out, true, 400);		    	
		    	c_detail.destroy();
		    	chemie.destroy();
		    	closeButton.destroy();
	    	},this);    	
	    }, this);
	}, this);
}

function CHANGE_PAGE(dir) {
	//dir = -1 -> swipe left -> to right page
	//dir = 1 -> swipe right -> to left page
	if (c_popup.y>0) {
		return;
	}
	if (curr_page_index==3 && dir<0) {
		return;
	} else if (curr_page_index==0 && dir>0){
		return;
	}
	paginate[curr_page_index].alpha = 0;
	curr_page_index-=dir;
	var t = game.add.tween(c_pages).to( {x: (-1)*curr_page_index*game.width}, 500, Phaser.Easing.Back.InOut, true);
	eType.alpha = 0;
	chemieBoxes.alpha = 0;
	box_atomicNums.alpha = 0;
	box_symbols.alpha = 0;
	t.onComplete.add(function(){
		paginate[curr_page_index].alpha = 1;
		if (curr_page_index<=1) {
			eType.text = 'Nonmetal';
		} else if (curr_page_index==2) {
			eType.text = 'Semimetal';
		} else {
			eType.text = 'Metal';
		}
		if (curr_page_index==0) {
			arrow_left.visible = false;
		} else if (curr_page_index==3) {
			arrow_right.visible = false;
		} else {
			arrow_left.visible = true;
			arrow_right.visible = true;
		}
		game.add.tween(eType).to({alpha: 1}, 500, Phaser.Easing.Back.InOut, true);
		SHOW_BOXES();
		chemieBoxes.alpha = 1;
		box_atomicNums.alpha = 1;
		box_symbols.alpha = 1;;
	}, this);
}


function PREV_PAGE() {
	CHANGE_PAGE(1);
}

function NEXT_PAGE() {
	CHANGE_PAGE(-1);
}
