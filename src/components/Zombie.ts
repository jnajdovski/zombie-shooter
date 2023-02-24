import { GameObjects, Scene } from "phaser";
import Pool from "../helpers/Pool";

export default class Zombie extends GameObjects.Sprite {
    private zombieAnimations: string[] = ['zombie_move', 'zombie_attack'];
    public hited: number = 0
    bulletsPool: Pool
    playerPosition: { x: number, y: number }
    public attackPlayer: boolean = false
    private attacking: boolean = false
    private movingAnimation: boolean = false

    constructor(scene: Scene, x: number, y: number, bulletsPool: Pool) {
        super(scene, x, y, 'zombie_move')
        this.setOrigin(0.5)
        this.setScale(0.8)
        this.createAnimations()
        this.scene.physics.add.existing(this, false)
        scene.children.add(this)
        this.setVisible(false)
        this.bulletsPool = bulletsPool

        //@ts-ignore
        this.body.offset.set(100, 100)
        //@ts-ignore
        this.body.width = 100
        //@ts-ignore
        this.body.height = 100
    }

    private createAnimations() {
        for (let anim of this.zombieAnimations) {
            this.scene.anims.create({
                key: anim,
                frameRate: anim == 'zombie_attack' ? 30 : 40,
                frames: this.scene.anims.generateFrameNumbers(anim, { start: 0 }),
                repeat: anim == 'zombie_attack' ? 1 : -1,
            })
        }
    }

    public attack() {
        this.movingAnimation = false
        this.play('zombie_attack').on('animationcomplete', () => {
            this.attacking = false
        })
    }

    public move() {
        if (!this.movingAnimation) {
            this.play('zombie_move')
            this.movingAnimation = true
        }
        //@ts-ignore
        this.scene.physics.velocityFromRotation(this.rotation, 100, this.body.velocity)
        //@ts-ignore
        this.body.angle = this.angle
    }

    public show(x, y) {
        this.scene.children.add(this)
        this.setVisible(true)
        this.setPosition(x, y)
    }

    public hide() {
        this.scene.children.remove(this)
        this.setVisible(false)
        this.hited = 0
        this.body.velocity.x = 0
        this.body.velocity.y = 0
        this.removeAllListeners()
    }

    update(playerPosition) {
        if (this.visible) {
            if (this.attackPlayer && !this.attacking) {
                this.attacking = true
                this.attack()
            } else if (!this.attackPlayer && !this.attacking) {
                this.playerPosition = playerPosition
                this.rotation = Phaser.Math.Angle.BetweenPoints(this, playerPosition)
                this.move()
            } else {
                this.body.velocity.x = 0
                this.body.velocity.y = 0
            }

            const bullets = this.bulletsPool.pool.map((obj) => obj.data)
            bullets.forEach((bullet) => {
                if (bullet.visible) {
                    this.scene.physics.overlap(this, bullet, () => {
                        bullet.hide()
                        this.hit()
                    })
                }
            })
        }
    }

    public hit() {
        this.hited++
        if (this.hited >= 4) {
            this.emit('kill')
        }
    }
}