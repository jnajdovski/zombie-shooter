import { GameObjects } from "phaser"

const getRandomNum = (max, min): number => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export const getRandomZombiePosition = (gameW: number, gameH: number): { x: number, y: number } => {
    const isLeft: boolean = Math.random() <= 0.5
    const isUp: boolean = Math.random() <= 0.5
    const fromSide: boolean = Math.random() <= 0.5

    if (fromSide) {
        return {
            x: isLeft ? -100 : gameW + 100,
            y: getRandomNum(0, gameH)
        }
    } else {
        return {
            x: getRandomNum(0, gameW),
            y: isUp ? -100 : gameH + 100
        }
    }
}

export const checkCollision = (obj1: GameObjects.Sprite, obj2: GameObjects.Sprite): boolean => {
    var boundsA = obj1.getBounds();
    var boundsB = obj2.getBounds();
    return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
}