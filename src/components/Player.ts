import { GameObjects, Input, Scene } from "phaser";
import { keyDown } from "../helpers/keyboardMovement";

export default class Player extends GameObjects.Sprite {

    playerAnimations: { name: string, endFrame: number }[] = [{ name: 'player_idle', endFrame: 19 }, { name: 'player_move', endFrame: 19 }, { name: 'player_shoot', endFrame: 2 }];
    speed: number = 8
    keys: { W: Input.Keyboard.Key, A: Input.Keyboard.Key, S: Input.Keyboard.Key, D: Input.Keyboard.Key }
    movingLeft: boolean = false
    movingRight: boolean = false
    movingDown: boolean = false
    movingUp: boolean = false
    playerShoot: boolean = false

    keyA: Input.Keyboard.Key
    keyS: Input.Keyboard.Key
    keyD: Input.Keyboard.Key
    keyW: Input.Keyboard.Key

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'player_idle', 0)
        this.setOrigin(0.5, 0.5)
        this.setScale(0.8)
        this.createAnimations()
        this.idle()
        scene.children.add(this)

        this.keys = {
            W: scene.input.keyboard.addKey('W'),
            A: scene.input.keyboard.addKey('A'),
            S: scene.input.keyboard.addKey('S'),
            D: scene.input.keyboard.addKey('D')
        }

        // window.addEventListener('keydown', (event) => {
        //     if (keyDown(event) === 'left') this.movingLeft = true
        //     if (keyDown(event) === 'right') this.movingRight = true
        //     if (keyDown(event) === 'down') this.movingDown = true
        //     if (keyDown(event) === 'up') this.movingUp = true
        // });

        // window.addEventListener('keyup', (event) => {
        //     if (keyDown(event) === 'left') this.movingLeft = false
        //     if (keyDown(event) === 'right') this.movingRight = false
        //     if (keyDown(event) === 'down') this.movingDown = false
        //     if (keyDown(event) === 'up') this.movingUp = false
        // });

        this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)

        // scene.input.on('keydown', () => {
        //     console.log('key down');

        // })

        scene.input.on('pointerdown', () => {
            this.playerShoot = true
            this.shoot()
        })
        scene.input.on('pointerup', () => {
            this.playerShoot = false
            this.idle()
        })
    }

    idle() {
        if (!this.playerShoot) {
            this.stop()
            this.play('player_idle')
        }
    }

    move() {
        if (!this.playerShoot) {
            this.stop()
            this.play('player_move')
        }
    }

    shoot() {
        this.stop()
        this.play('player_shoot')
    }

    private moveLeft() {
        this.move()
        const nextPos = this.x - this.speed
        if (nextPos > 0) {
            this.setX(nextPos)
        }
    }

    private moveRight() {
        this.move()
        const nextPos = this.x + this.speed
        if (nextPos < this.scene.cameras.main.width) {
            this.setX(this.x + this.speed)
        }
    }

    private moveUp() {
        this.move()
        const nextPos = this.y - this.speed
        if (nextPos > 0) {
            this.setY(nextPos)
        }
    }

    private moveDown() {
        this.move()
        const nextPos = this.y + this.speed
        if (nextPos < this.scene.cameras.main.height) {
            this.setY(nextPos)
        }
    }

    rotatePlayer(pointer: PointerEvent) {
        this.rotation = Phaser.Math.Angle.BetweenPoints(this, pointer)
    }

    update() {
        if (this.keyD.isDown) this.moveRight()
        if (this.keyA.isDown) this.moveLeft()
        if (this.keyS.isDown) this.moveDown()
        if (this.keyW.isDown) this.moveUp()
        if (this.keyW.isUp && this.keyA.isUp && this.keyS.isUp && this.keyD.isUp) this.idle()
    }

    private createAnimations() {
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