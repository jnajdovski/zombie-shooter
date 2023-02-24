import { GameObjects, Scene } from "phaser";

export default class Blood extends GameObjects.Sprite {
    constructor(scene: Scene) {
        super(scene, 0, 0, 'blood')
        this.setOrigin(0.5)
        this.setVisible(false)

        this.scene.anims.create({
            key: 'blood',
            frameRate: 24,
            frames: this.scene.anims.generateFrameNumbers('blood', { start: 0 }),
            repeat: 0,
        })
    }

    show(x, y) {
        this.setVisible(true)
        this.play('blood')
        this.setPosition(x, y)
        this.scene.children.add(this)

    }

    hide() {
        this.setVisible(false)
        this.scene.children.remove(this)
    }
}