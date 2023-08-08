export class AsyncBlockingQueue<T> {
    private _promises: Promise<T>[];
    private _resolvers: ((t: T) => void)[];

    constructor() {
        this._resolvers = [];
        this._promises = [];
    }

    private _add() {
        this._promises.push(new Promise(resolve => {
            this._resolvers.push(resolve);
        }));
    }

    enqueue(t: T): void {
        if (this.isFree()) this._add();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this._resolvers.shift()!(t);
        // resolve(t);
    }

    dequeue(): Promise<T> {
        if (this.isEmpty()) this._add();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this._promises.shift()!;
        // return promise;
    }

    isEmpty(): boolean {
        return !this._promises.length;
    }

    isFree(): boolean {
        return !this._resolvers.length;
    }

    isBlocked(): boolean {
        return !this.isFree();
    }

    get length(): number {
        return this._promises.length - this._resolvers.length;
    }
}