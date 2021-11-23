const UP = 'UP', DOWN = 'DOWN', LEFT = 'LEFT', RIGHT = 'RIGHT'
const CELL_SIZE = 32

const GameScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { key: 'gameScene'})
  },
  preload: function () {
    // load our assets
    this.load.image('player', '/assets/player.png')
    this.load.image('board', '/assets/board.png')
  },
  create: function () {
    // add board
    this.add.image(400, 350, 'board')
    // add assets to the scene
    const x = 336 // 400 - (32 * 2)
    const y = 414; // 350 + (32 * 2)

    this.me = this.add.container(x, y)
    const playerImg = this.add.image(0, 0, 'player')
    const numTxt = this.add.text(0, 0, '1')

    numTxt.setOrigin(0.5, 0.5)
    this.me.add(playerImg)
    this.me.add(numTxt) 

    // allow cursor keys
    this.cursors = this.input.keyboard.createCursorKeys();
    this.move = '';
  },
  update: function () {
    if(this.cursors.up.isDown) {
      this.move = 'up'
    } else if (this.cursors.down.isDown) {
      this.move = 'down'
    } else if (this.cursors.left.isDown) {
      this.move = 'left'
    } else if (this.cursors.right.isDown) {
      this.move = 'right'
    }

    // trigger movement
    if (this.move === 'up' && this.cursors.up.isUp) {
      this.me.y -= CELL_SIZE // move 1 cell up
      this.move = '' // reset movement
    } else if (this.move === 'down' && this.cursors.down.isUp) {
      this.me.y += CELL_SIZE 
      this.move = ''
    } else if (this.move === 'left' && this.cursors.left.isUp) {
      this.me.x -= CELL_SIZE 
      this.move = ''
    } else if (this.move === 'right' && this.cursors.right.isUp) {
      this.me.x += CELL_SIZE 
      this.move = ''
    }
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