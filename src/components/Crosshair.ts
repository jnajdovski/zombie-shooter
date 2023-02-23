import { GameObjects, Scene } from "phaser";

export default class Crosshair extends GameObjects.Sprite {
    constructor(scene: Scene) {
        super(scene, scene.cameras.main.width / 2, scene.cameras.main.height / 2, 'crosshair')
        this.setOrigin(0.5, 0.5)
        this.setScale(.1)
        scene.children.add(this)

        scene.input.on('pointermove', (pointer) => this.pointerMove(pointer))
    }

    pointerMove(pointer: PointerEvent) {
        this.setPosition(pointer.x, pointer.y)
    }
}