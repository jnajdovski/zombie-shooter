import { GameObjects, Scene } from "phaser";

export default class Bullet extends GameObjects.Sprite {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'bullet')
        this.setOrigin(0.5)
        this.setScale(0.7)
        this.visible = false
        scene.children.add(this)

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
        this.visible = false
    }

    show(x: number, y: number): void {
        this.setPosition(x, y)
        this.visible = true
    }
}