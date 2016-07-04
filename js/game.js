
//new Game(width, height, renderer, parent, state, transparent, antialias, physicsConfig)
var game = new Phaser.Game(375, 667, Phaser.AUTO, 'gameDiv');
		
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('title', titleState);
game.state.add('collect', collectState);
game.state.add('level', levelState);
game.state.add('info', infoState);
game.state.add('play', playState);
game.state.add('win', winState);

game.state.start('boot');
