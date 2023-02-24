import { GameObjects, Scene } from "phaser";
import TextButton from "../components/TextButton";

export default class GameOverScene extends Scene {
    private gameOverText: GameObjects.Text
    private backToMenu: TextButton
    private background: GameObjects.Image
    private killsText: GameObjects.Text

    create({ kills }) {

        this.background = new GameObjects.Image(this, 0, 0, 'background')
        this.background.setOrigin(0, 0)
        this.background.setDisplaySize(this.cameras.main.width, this.cameras.main.height)
        this.background.setTint(0x962c0c)
        this.children.add(this.background)

        this.gameOverText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, 'GAME OVER', {
            fontFamily: 'Quicksand',
            fontSize: '68px',
            color: '#fff'
        })
        this.gameOverText.setOrigin(0.5)
        this.children.add(this.gameOverText)

        this.killsText = this.add.text(this.gameOverText.x, this.gameOverText.y + 50, `KILLS: ${kills}`, {
            fontFamily: 'Quicksand',
            fontSize: '50px',
            color: '#fff'
        })
        this.killsText.setOrigin(0.5)
        this.children.add(this.killsText)

        this.backToMenu = new TextButton(this, this.cameras.main.width / 2, this.cameras.main.height - 50, 'BACK TO MENU', {
            fontFamily: 'Quicksand',
            fontSize: '42px',
            color: '#fff'
        })

        this.backToMenu.enable()

        this.children.add(this.backToMenu)
        this.backToMenu.on('pointerdown', () => this.goToMenu())
    }

    goToMenu() {
        this.scene.start('menu')
    }
}