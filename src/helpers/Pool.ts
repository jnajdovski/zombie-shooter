export class PoolObject {
    public data: any
    public nextFree: PoolObject | null
    public previousFree: PoolObject | null
    public free: boolean

    constructor(data: any) {
        this.data = data;
        this.nextFree = null;
        this.previousFree = null;
        this.free = true
    }
}

export default class Pool {
    public pool: PoolObject[]
    objCreator: Function
    objReseter: Function
    lastFree: PoolObject | null
    nextFree: PoolObject | null

    constructor(objCreator: Function, objReseter: Function, initialSize: number = 200) {
        this.pool = [];
        this.objCreator = objCreator;
        this.objReseter = objReseter;
        for (let i = 0; i < initialSize; i++) {
            this.addNewObject(this.newPoolObject());
        }
    }

    addNewObject(obj: PoolObject) {
        this.pool.push(obj);
        this.release(obj);
        return obj;
    }

    release(poolObject) {
        poolObject.free = true;

        poolObject.nextFree = null;
        poolObject.previousFree = this.lastFree;

        if (poolObject.previousFree && this.lastFree) {
            this.lastFree.nextFree = poolObject;
        } else {
            this.nextFree = poolObject;
        }

        this.lastFree = poolObject;

        this.objReseter(poolObject);
    }

    getFree() {
        const freeObject = this.nextFree ? this.nextFree : this.addNewObject(this.newPoolObject());
        freeObject.free = false;

        this.nextFree = freeObject.nextFree;

        if (!this.nextFree) this.lastFree = null;

        return freeObject;
    }

    newPoolObject() {
        const data = this.objCreator();
        return new PoolObject(data);
    }

    releaseAll() {
        this.pool.forEach(item => this.release(item));
    }
}