import { NS } from '@ns';
import { Daemon } from '/interface/daemon';

export class ServerBuyer implements Daemon {
    isRunning = false;

    async run(ns: NS): Promise<void> {
        this.isRunning = true;
        ns.tprintf('ServerBuyer is running!');
        let i = 0;
        while (i < 10000) {
            await ns.sleep(2);
            i++;
        }
        ns.tprintf('ServerBuyer is ended!');
    }

    // static SINGLETON_LOCK = false;

}