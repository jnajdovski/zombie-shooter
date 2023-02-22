import {
    Game
} from 'phaser'
import config from './config'
import Boot from './scenes/BootScene'
import Menu from './scenes/MenuScene'
import GameScene from './scenes/GameScene'

const game = new Game(config)

game.scene.add('boot', new Boot({}))
game.scene.add('menu', new Menu({}))
game.scene.add('game', new GameScene({}))
game.scene.start('boot')