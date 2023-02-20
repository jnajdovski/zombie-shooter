import {
    Game
} from 'phaser'
import config from './config'
import Boot from './scenes/Boot'
import Menu from './scenes/Menu'

const game = new Game(config)

game.scene.add('boot', new Boot({}))
game.scene.add('menu', new Menu({}))
game.scene.start('boot')