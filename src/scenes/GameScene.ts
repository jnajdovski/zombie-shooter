import { GameObjects, Scene } from "phaser";
import Crosshair from "../components/Crosshair";
import Player from "../components/Player";

export default class GameScene extends Scene {
    player: Player
    background: GameObjects.Image
    crosshair: Crosshair
    create() {
        this.background = new GameObjects.Image(this, 0, 0, 'background')
        this.background.setOrigin(0, 0)
        this.background.setDisplaySize(this.cameras.main.width, this.cameras.main.height)
        this.children.add(this.background)

        this.player = new Player(this, this.cameras.main.width / 2, this.cameras.main.height / 2)
        this.crosshair = new Crosshair(this)

        this.input.on('pointermove', (pointer) => {
            this.player.rotatePlayer(pointer)
            this.crosshair.pointerMove(pointer)
        })

        this.input.on('pointerdown', () => this.player.shoot())
        this.input.on('pointerup', () => this.player.idle())
    }

    update(time: number, delta: number): void {
        this.player.update()
    }
}