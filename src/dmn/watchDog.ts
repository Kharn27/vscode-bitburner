import { NS } from '@ns';
import { AsyncBlockingQueue } from '/obj/asyncBlockingQueue';
import { ServerData } from '/obj/serverInterfaces';

export class RootableSrvWatchDog {

    constructor(private ns: NS, private asyncQueue: AsyncBlockingQueue<ServerData>) {
        this.ns = ns;
        this.asyncQueue = asyncQueue;
    }

    run = async (): Promise<void> => {

        while (true) {
            const serverProm = this.asyncQueue.dequeue();
            this.ns.tprint(`Waiting for new Server...`);
            await serverProm.then((server: ServerData) => {
                this.ns.tprint(`New Server Received : ${server.hostName}:${server.ip}`);
            }).catch((e) => {
                this.ns.tprint(e);
            })
            this.ns.tprint("Cycle ended");
            await this.ns.sleep(20);
        }
    }
}