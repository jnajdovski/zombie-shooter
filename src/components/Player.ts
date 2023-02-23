import { GameObjects, Input, Scene } from "phaser";
import Pool, { PoolObject } from "../helpers/Pool";
import Bullet from "./Bullet";

export default class Player extends GameObjects.Sprite {
    private playerAnimations: string[] = ['player_idle', 'player_move', 'player_shoot'];
    private speed: number = 8
    private playerShoot: boolean = false
    private keyA: Input.Keyboard.Key
    private keyS: Input.Keyboard.Key
    private keyD: Input.Keyboard.Key
    private keyW: Input.Keyboard.Key
    private waitForNextBullet = false
    public bulletsPool: Pool
    private kills: number = 0
    private health: number = 200

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'player_idle', 0)
        this.setOrigin(0.5, 0.7)
        this.setScale(0.8)
        this.createAnimations()
        this.idle()
        this.setPlayerEvents()

        this.bulletsPool = new Pool(() => this.createBullets(), (obj) => this.resetBullets(obj), 100)
        this.scene.physics.add.existing(this)
        scene.children.add(this)

        //@ts-ignore
        this.body.offset.set(100, 100)
        //@ts-ignore
        this.body.width = 100
        //@ts-ignore
        this.body.height = 100
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

    public updateHealth(): void {
        this.health -= 5
    }

    public getHealth(): number {
        return this.health
    }


    public updateKills() {
        this.kills += 1
    }

    public getKills() {
        return this.kills
    }


    public rotatePlayer(pointer: PointerEvent) {
        this.rotation = Phaser.Math.Angle.BetweenPoints(this, pointer)
    }

    public getPosition(): { x: number, y: number } {
        return { x: this.x, y: this.y }
    }

    private createBullets() {
        return new Bullet(this.scene, this.x, this.y)
    }

    private resetBullets(obj: PoolObject) {
        obj.data.hide()
        obj.free = true
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
        bullet.free = false

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
                key: anim,
                frameRate: 40,
                frames: this.scene.anims.generateFrameNumbers(anim, { start: 0 }),
                repeat: anim === 'player_shoot' ? 1 : -1,
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

        this.body.velocity.x = 0
        this.body.velocity.y = 0
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