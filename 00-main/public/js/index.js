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
    this.socket = io()
    // add board
    this.add.image(400, 350, 'board')

    // allow cursor keys
    this.cursors = this.input.keyboard.createCursorKeys()
    this.move = '';

    this.addSocketEvents()
    this.otherPlayers = this.add.group()
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

    // send movement to server
    if (this.me) {
      const { x, y } = this.me
      if (
        this.me.oldPosition && 
        (x !== this.me.oldPosition.x || y !== this.me.oldPosition.y)
      ) {
        this.socket.emit('playerMovement', { x, y })
      }
      this.me.oldPosition = { x, y }
    }
  },
  addSocketEvents: function () {
    this.socket.on('currentPlayers', players => {
      console.log(players)
      Object.keys(players).forEach(playerId => {
        if(playerId === this.socket.id) {
          this.addPlayer(players[playerId])
        } else {
          this.addOtherPlayers(players[playerId], playerId)
        }
      })
    })

    this.socket.on('playerMoved', playerInfo => {
      const { x, y, playerId } = playerInfo
      console.log('playerMoved', playerInfo)
      this.otherPlayers.getChildren().forEach(otherPlayer => {
        if(playerId == otherPlayer.playerId) {
          otherPlayer.setPosition(x, y)
        }
      })
    })

    this.socket.on('playerDc', playerId => {
      this.otherPlayers.getChildren().forEach(otherPlayer=> {
        if(playerId == otherPlayer.playerId) {
          otherPlayer.destroy()
        }
      })
    })

    this.socket.on('newPlayer', playerInfo => {
      this.addOtherPlayers(playerInfo, playerInfo.playerId)
    })
  },
  addPlayer: function (playerInfo, playerId) {
    const { x, y } = playerInfo
    this.me = this.add.container(x, y)
    const playerImg = this.add.image(0, 0, 'player')
    const numTxt = this.add.text(0, 0, '1')

    numTxt.setOrigin(0.5, 0.5)
    this.me.add(playerImg)
    this.me.add(numTxt)
    this.me.setDepth(1000)
  },
  addOtherPlayers: function (playerInfo, playerId) {
    const { x, y } = playerInfo
    const otherPlayer = this.add.container(x, y)
    const playerImg = this.add.image(0, 0, 'player')
    const numTxt = this.add.text(0, 0, '2')

    numTxt.setOrigin(0.5, 0.5)
    otherPlayer.add(playerImg)
    otherPlayer.add(numTxt)
    otherPlayer.playerId = playerId

    this.otherPlayers.add(otherPlayer)
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