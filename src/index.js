import {
    Game
} from 'phaser'
import config from './config'
import Menu from './scenes/Menu'
import Boot from './scenes/Boot'

const game = new Game(config)

game.scene.add('boot', new Boot())
game.scene.add('menu', new Menu())
game.scene.start('boot')