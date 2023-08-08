
export class Queue<T> {

    private queue: T[];

    constructor (){
        this.queue = [];
    }

    enqueue(item: T) :void {
        this.queue.push(item);
    }

    dequeue(): T {
        return <T> this.queue.shift();
    }

    isEmpty(): boolean {
        return this.queue.length === 0; 
    }

    size(): number {
        return this.queue.length;
    }


}