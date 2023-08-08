import { NS } from '@ns'
import { Queue } from '/obj/queue';

export class Executor<T> {

    constructor(private queue: Queue<T>) {
        this.queue = queue;
    }


    test():T {
        return this.queue.dequeue();
    }

}
