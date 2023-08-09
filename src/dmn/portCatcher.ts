import { NS } from '@ns';
import { FOO_PORT, PORT_G, PORT_H, PORT_W, growedSrv, hackedSrv, weakedSrv } from '/lib/constants';


export async function main(ns: NS): Promise<void> {
    ns.disableLog('sleep');
    // loop
    while (true) {
        const weakedServerToFree = <string>ns.readPort(PORT_W);
        const hackedServerToFree = <string>ns.readPort(PORT_H);
        const growedServerToFree = <string>ns.readPort(PORT_G);

        const noWeakSrvFree = weakedServerToFree === FOO_PORT;
        const noHackedSrvFree = hackedServerToFree === FOO_PORT;
        const noGrowedSrvFree = growedServerToFree === FOO_PORT;

        if (!noGrowedSrvFree) {
            ns.print(`Receive growedServer to free : ${growedServerToFree}`);
            if (growedSrv.has(growedServerToFree)) {
                ns.print(`Growed ${growedServerToFree} is free`);
                growedSrv.delete(growedServerToFree);
            } else {
                ns.print(`ERROR : ${growedServerToFree} cannot be bound`);
            }
        }

        if (!noHackedSrvFree) {
            ns.print(`Receive hackedServer to free : ${hackedServerToFree}`);
            if (hackedSrv.has(hackedServerToFree)) {
                ns.print(`Hacked ${hackedServerToFree} is free`);
                hackedSrv.delete(hackedServerToFree);
            } else {
                ns.print(`ERROR : ${hackedServerToFree} cannot be bound`);
            }
        }

        if (!noWeakSrvFree) {
            ns.print(`Receive weakedServer to free : ${weakedServerToFree}`);
            if (weakedSrv.has(weakedServerToFree)) {
                ns.print(`Weakened ${weakedServerToFree} is free`);
                weakedSrv.delete(weakedServerToFree);
            } else {
                ns.print(`ERROR : ${weakedServerToFree} cannot be bound`);
            }
        }

        // // if idle, sleep more
        // if (noWeakSrvFree && noHackedSrvFree && noGrowedSrvFree) {
        //     await ns.sleep(250);
        // } else {
        //     await ns.sleep(5);
        // }

        // if idle, sleep more
        if (noWeakSrvFree && noHackedSrvFree && noGrowedSrvFree) {
            await ns.sleep(3333);
        } else {
            await ns.sleep(1667);
        }
    }

}