import {
    Game
} from 'phaser'
import config from './config'
import Boot from './scenes/BootScene'
import Menu from './scenes/MenuScene'
import GameScene from './scenes/GameScene'
import GameOverScene from './scenes/GameOverScene'

const game = new Game(config)

game.scene.add('boot', new Boot({}))
game.scene.add('menu', new Menu({}))
game.scene.add('game', new GameScene({}))
game.scene.add('game_over', new GameOverScene({}))
game.scene.start('boot')