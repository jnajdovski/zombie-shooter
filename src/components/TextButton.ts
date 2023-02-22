import { GameObjects, Scene } from "phaser";

export default class TextButton extends GameObjects.Text {
    constructor(scene: Scene, x: number, y: number, text: string, style = {
        fontFamily: 'Quicksand',
        fontSize: '48px',
        color: '#fff'
    }) {
        super(scene, x, y, text, style)

        this.setOrigin(0.5, 0.5)

        scene.children.add(this)
    }

    enable() {
        this.setInteractive({ cursor: 'pointer' })
    }

    disable() {
        this.disableInteractive()
    }
}