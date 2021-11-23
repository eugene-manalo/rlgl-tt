const GameScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { key: 'gameScene'})
  },
  preload: function () {
    // load our assets
    this.load.image('player', '/assets/player.png')
  },
  create: function () {
    // add assets to the scene
    const x = 0, y = 0;
    this.me = this.add.container(x, y)
    const playerImg = this.add.image(0, 0, 'player')
    const numTxt = this.add.text(0, 0, '1')

    numTxt.setOrigin(0.5, 0.5)
    this.me.add(playerImg)
    this.me.add(numTxt) 
  },
  update: function () {

  }
})

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-rlgl',
  width: 800,
  height: 700,
  backgroundColor: '#4488AA',
  scene: [GameScene]
};

new Phaser.Game(config)