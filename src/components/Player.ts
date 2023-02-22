import { Animations, GameObjects, Input, Scene } from "phaser";
import { keyDown } from "../helpers/keyboardMovement";

export default class Player extends GameObjects.Sprite {

    playerAnimations: { name: string, endFrame: number }[] = [{ name: 'player_idle', endFrame: 19 }, { name: 'player_move', endFrame: 19 }, { name: 'player_shoot', endFrame: 2 }];
    speed: number = 8
    keys: { W: Input.Keyboard.Key, A: Input.Keyboard.Key, S: Input.Keyboard.Key, D: Input.Keyboard.Key }
    currentAnimPlayed: string = ''
    moveLeft: boolean = false
    moveRight: boolean = false
    moveDown: boolean = false
    moveUp: boolean = false

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'player_idle', 0)
        this.setOrigin(0.5, 0.5)
        this.setScale(0.8)
        this._createAnimations()
        this.idle()
        scene.children.add(this)

        this.keys = {
            W: scene.input.keyboard.addKey('W'),
            A: scene.input.keyboard.addKey('A'),
            S: scene.input.keyboard.addKey('S'),
            D: scene.input.keyboard.addKey('D')
        }

        window.addEventListener('keydown', (event) => {
            if (keyDown(event) === 'left') this.moveLeft = true
            if (keyDown(event) === 'right') this.moveRight = true
            if (keyDown(event) === 'down') this.moveDown = true
            if (keyDown(event) === 'up') this.moveUp = true
        });

        window.addEventListener('keyup', (event) => {
            if (keyDown(event) === 'left') this.moveLeft = false
            if (keyDown(event) === 'right') this.moveRight = false
            if (keyDown(event) === 'down') this.moveDown = false
            if (keyDown(event) === 'up') this.moveUp = false
        });
    }

    idle() {
        this.play('player_idle')
        this.currentAnimPlayed = 'idle'
    }

    move(direction: string) {
        this.play('player_move')
        this[`_move${direction}`]()
    }

    shoot() {
        this.play('player_shoot')
    }

    _moveLeft() {
        const nextPos = this.x - this.speed
        if (nextPos > 0) {
            this.setX(nextPos)
        }
    }

    _moveRight() {
        const nextPos = this.x + this.speed
        if (nextPos < this.scene.cameras.main.width) {
            this.setX(this.x + this.speed)
        }
    }

    _moveUp() {
        const nextPos = this.y - this.speed
        if (nextPos > 0) {
            this.setY(nextPos)
        }
    }

    _moveDown() {
        const nextPos = this.y + this.speed
        if (nextPos < this.scene.cameras.main.height) {
            this.setY(nextPos)
        }
    }

    rotatePlayer(pointer: PointerEvent) {
        this.rotation = Phaser.Math.Angle.BetweenPoints(this, pointer)
    }

    update() {
        if (this.moveRight) this._moveRight()
        if (this.moveLeft) this._moveLeft()
        if (this.moveDown) this._moveDown()
        if (this.moveUp) this._moveUp()
    }

    _createAnimations() {
        for (let anim of this.playerAnimations) {
            this.scene.anims.create({
                key: anim.name,
                frameRate: 40,
                frames: this.scene.anims.generateFrameNumbers(anim.name, { start: 0, end: anim.endFrame }),
                repeat: -1
            })
        }
    }
}