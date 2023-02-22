import {
    GameObjects,
    Scene
} from 'phaser'
import TextButton from '../components/TextButton'

export default class Menu extends Scene {

    background: GameObjects.Image
    btnPlay: TextButton

    create() {
        this.background = new GameObjects.Image(this, 0, 0, 'background')
        this.background.setOrigin(0, 0)
        this.background.setDisplaySize(this.cameras.main.width, this.cameras.main.height)
        this.children.add(this.background)

        this.btnPlay = new TextButton(this, this.cameras.main.width / 2, this.cameras.main.height / 2, 'PLAY')
        this.btnPlay.enable()
        this.btnPlay.on('pointerdown', this.playGame, this)
    }

    playGame() {
        this.scene.start('game')
    }
}