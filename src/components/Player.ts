import { GameObjects, Input, Scene } from "phaser";
import Pool, { PoolObject } from "../helpers/Pool";
import Bullet from "./Bullet";

export default class Player extends GameObjects.Sprite {
    private playerAnimations: { name: string, endFrame: number }[] = [{ name: 'player_idle', endFrame: 19 }, { name: 'player_move', endFrame: 19 }, { name: 'player_shoot', endFrame: 2 }];
    private speed: number = 8
    private playerShoot: boolean = false
    private keyA: Input.Keyboard.Key
    private keyS: Input.Keyboard.Key
    private keyD: Input.Keyboard.Key
    private keyW: Input.Keyboard.Key
    private waitForNextBullet = false
    private bulletsPool: Pool

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'player_idle', 0)
        this.setOrigin(0.5, 0.7)
        this.setScale(0.8)
        this.createAnimations()
        this.idle()
        this.setPlayerEvents()

        this.bulletsPool = new Pool(() => this.createBullets(), (obj) => this.resetBullets(obj), 100)

        scene.children.add(this)
    }

    private setPlayerEvents() {
        this.keyW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.keyS = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)

        this.scene.input.on('pointerdown', (pointer: PointerEvent) => {
            if (pointer.button === 0) {
                this.playerShoot = true
                this.shoot()
            }
        })

        this.scene.input.on('pointerup', () => {
            this.playerShoot = false
            this.waitForNextBullet = false
            this.idle()
        })

        this.setInteractive()
        this.scene.input.on('pointermove', (pointer) => this.rotatePlayer(pointer))
    }

    public rotatePlayer(pointer: PointerEvent) {
        this.rotation = Phaser.Math.Angle.BetweenPoints(this, pointer)
    }

    private createBullets() {
        return new Bullet(this.scene, this.x, this.y)
    }

    private resetBullets(obj: PoolObject) {
        obj.data.hide()
    }

    private idle() {
        if (!this.playerShoot) {
            this.stop()
            this.play('player_idle')
        }
    }

    private move() {
        if (!this.playerShoot) {
            this.stop()
            this.play('player_move')
        }
    }

    private shoot() {
        this.play('player_shoot')
        if (!this.waitForNextBullet) {
            this.fireBullet()
        }
    }

    private fireBullet() {
        this.waitForNextBullet = true
        const bullet = this.bulletsPool.getFree()
        bullet.data.show(this.x, this.y)
        bullet.data.rotation = this.rotation

        setTimeout(() => {
            this.waitForNextBullet = false
        }, 150);
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

    private createAnimations() {
        for (let anim of this.playerAnimations) {
            this.scene.anims.create({
                key: anim.name,
                frameRate: 40,
                frames: this.scene.anims.generateFrameNumbers(anim.name, { start: 0, end: anim.endFrame }),
                repeat: anim.name === 'player_shoot' ? 1 : -1,
            })
        }
    }

    update() {
        if (this.keyD.isDown) this.moveRight()
        if (this.keyA.isDown) this.moveLeft()
        if (this.keyS.isDown) this.moveDown()
        if (this.keyW.isDown) this.moveUp()
        if (this.keyW.isUp && this.keyA.isUp && this.keyS.isUp && this.keyD.isUp) this.idle()

        this.updateBullets()
    }

    updateBullets() {
        this.bulletsPool.pool.forEach((obj) => {
            if (!obj.free) {
                if (obj.data.x > 0 && obj.data.x < this.scene.cameras.main.width
                    && obj.data.y > 0 && obj.data.y < this.scene.cameras.main.height) {
                    obj.data.update()
                }
                else this.bulletsPool.release(obj)
            }
        })
    }
}