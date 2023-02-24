import { GameObjects, Scene, Tweens } from "phaser";

export default class Bullet extends GameObjects.Sprite {
    alphaTween: Tweens.Tween
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'bullet')
        this.setOrigin(0.5)
        this.setScale(0.7)
        this.setVisible(false)
        this.scene.physics.add.existing(this)
    }

    update(): void {
        this.move()
    }

    move(): void {
        //@ts-ignore
        this.scene.physics.velocityFromRotation(this.rotation, 2000, this.body.velocity)
    }

    hide(): void {
        this.setVisible(false)
        this.scene.children.remove(this)
        if (this.alphaTween) this.alphaTween.remove()
    }

    show(x: number, y: number): void {
        this.setPosition(x, y)
        this.setVisible(true)
        this.setAlpha(0)
        this.alphaTween = this.scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: 150
        })
        this.scene.children.add(this)
    }
}