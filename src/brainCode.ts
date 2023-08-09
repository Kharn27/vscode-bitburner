import { NS } from '@ns';
import { PORT_G, PORT_H, PORT_W, initLog, scriptNames, scriptRam } from '/lib/constants';

export async function main(ns: NS): Promise<void> {
    initGlobalConstant(ns);


    ns.tprint(`INFO: Démarrage du daemon dmn/rootServer...`);
    ns.exec('dmn/rootServer.js', 'home', 1);
    await ns.sleep(2500);

    ns.tprint(`INFO: Démarrage du daemon dmn/portCatcher...`);
    ns.exec('dmn/portCatcher.js', 'home', 1);

    ns.tprint(`INFO: Démarrage du daemon dmn/workDaemon...`);
    ns.exec('dmn/workDaemon.js', 'home', 1);

    while (true) {
        // const servers: Set<ServerData> = ServerData.getServerList(ns);
        // const bestServer: ServerData = getBestServer(ns, servers);

        // let targetServer = new ServerData(ns);
        // servers.forEach(srvRunner => {
        //     if (srvRunner.rooted) {
        //         if (srvRunner.money.max === 0) {
        //             targetServer = bestServer;
        //         } else {
        //             targetServer = srvRunner;
        //         }

        //         if (!targetServer.isFoo) {

        //             // Defines how much money a server should have before we hack it
        //             // In this case, it is set to 75% of the server's max money
        //             const moneyThresh = targetServer.money.max * 0.75;

        //             // Defines the maximum security level the target server can
        //             // have. If the target's security level is higher than this,
        //             // we'll weaken it before doing anything else
        //             const securityThresh = targetServer.sec.min + 5;
        //             let availableThread = 0;
        //             if (targetServer.sec.secLvl > securityThresh) {
        //                 availableThread = srvRunner.availableThread(scriptRam[2]);
        //                 if (availableThread > 0) {
        //                     // If the server's security level is above our threshold, weaken it
        //                     ns.exec(scriptNames[2], srvRunner.hostName, availableThread, targetServer.hostName);
        //                 }
        //             } else if (targetServer.money.available < moneyThresh) {
        //                 availableThread = srvRunner.availableThread(scriptRam[0]);
        //                 if (availableThread > 0) {
        //                     // If the server's money is less than our threshold, grow it
        //                     ns.exec(scriptNames[0], srvRunner.hostName, availableThread, targetServer.hostName);
        //                 }
        //             } else {
        //                 availableThread = srvRunner.availableThread(scriptRam[1]);
        //                 if (availableThread > 0) {
        //                     // Otherwise, hack it
        //                     ns.exec(scriptNames[1], srvRunner.hostName, availableThread, targetServer.hostName);
        //                 }
        //             }
        //         } else {
        //             ns.tprint(`Rien a faire pour le server ${srvRunner.hostName} !`);
        //         }
        //     }
        // });

        // await ns.sleep(20);

        await ns.sleep(1000);
    }


    // for (const server in servers) {
    //     ns.scp(["/bin/grow.js","/bin/grow.js","/bin/hack.js",])

    //     ns.tprint("" + server);
    // }

}

function initGlobalConstant(ns: NS) {
    initLog(ns);
    ns.clearPort(PORT_H);
    ns.clearPort(PORT_G);
    ns.clearPort(PORT_W);

    for (const i in scriptNames) {
        const s = scriptNames[i];
        scriptRam[i] = ns.getScriptRam(s);
        ns.tprint(`Ram usage for ${s} : ${scriptRam[i]}`);
    }

}