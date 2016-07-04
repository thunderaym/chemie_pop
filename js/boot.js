
WebFontConfig = {
	active: function() {     
    },
    google: {
      families: ['Varela Round', 'Nunito', 'Muli', 'Signika Negative']
    }
};

var bootState = {
	
	preload: function() {
		game.load.script('webfont', 'http://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
		game.load.image('loadBG', 'assets/bg/startup-750x1334.png');

	},
	
	create: function() {
				
		game.physics.startSystem(Phaser.Physics.P2JS);
		
		if (game.device.desktop) {
			game.scale.maxWidth = game.width;
			game.scale.maxHeight = game.height;
			
		}
				
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.updateLayout(true);
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		
        game.scale.refresh();
		
		game.state.start('load');
				
	}
		
};