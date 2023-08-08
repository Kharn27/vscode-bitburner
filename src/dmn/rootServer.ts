import { NS } from '@ns';
import { execNames, scriptNames } from '/lib/constants';
import { ServerData } from '/obj/serverInterfaces';


const Attack = {
    BRUTE_SSH: { canDo: (ns: NS) => ns.fileExists(execNames[0]), exec: (ns: NS, hostname: string) => { ns.brutessh(hostname); ns.toast(`BruteSSH ${hostname} OK`, "success", 3000); } },
    FTP_CRACK: { canDo: (ns: NS) => ns.fileExists(execNames[1]), exec: (ns: NS, hostname: string) => { ns.ftpcrack(hostname); ns.toast(`FTPCrack ${hostname} OK`, "success", 3000); } },
    RELAY_SMTP: { canDo: (ns: NS) => ns.fileExists(execNames[2]), exec: (ns: NS, hostname: string) => { ns.relaysmtp(hostname); ns.toast(`RelaySMTP ${hostname} OK`, "success", 3000); } },
    HTTP_WORM: { canDo: (ns: NS) => ns.fileExists(execNames[3]), exec: (ns: NS, hostname: string) => { ns.httpworm(hostname); ns.toast(`HTTPWorm ${hostname} OK`, "success", 3000); } },
    SQL_INJECT: { canDo: (ns: NS) => ns.fileExists(execNames[4]), exec: (ns: NS, hostname: string) => { ns.sqlinject(hostname); ns.toast(`SQLInject ${hostname} OK`, "success", 3000); } },
    FOO_ATTACK: { canDo: (ns: NS) => ns.fileExists('fooAttack.exe'), exec: (ns: NS, hostname: string) => { ns.sqlinject(hostname); ns.toast(`FooAttack ${hostname} OK`, "success", 3000) } }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getAttackObject(key: string): any {
    return eval("Attack['" + key + "']");
}

function rootForce(ns: NS): number {
    let count = 0;
    execNames.forEach((script) => {
        if (ns.fileExists(script)) count++;
    });
    return count;
}


export async function main(ns: NS): Promise<void> {
    // Refresh scripts on all runners
    ServerData.getRunnerServer(ns, true).forEach(srv => {
        spreadScripts(ns, srv);
    });

    // Wait for new income
    while (true) {
        const serverList = ServerData.getServers(ns);
        serverList.filter(srv => srv.isNewTarget(rootForce(ns))).forEach(srv => {
            compromiseServer(ns, srv);
            spreadScripts(ns, srv);
        });
        await ns.sleep(500);
    }

    //
}

function compromiseServer(ns: NS, srv: ServerData): void {
    ns.tprint(`INFO: New Server to Hack -> ${srv.hostName}`);
    for (const key of Object.keys(Attack)) {
        const attack = getAttackObject(key);
        if (attack.canDo(ns)) {
            attack.exec(ns, srv.hostName);
        }
    }
    ns.tprint(`INFO: ${srv.hostName} is now NUKED !`);
}

/**
 * Spreads the specified scripts to the given server.
 *
 * @param {NS} ns - The namespace object.
 * @param {ServerData} srv - The server to spread the scripts to.
 */
function spreadScripts(ns: NS, srv: ServerData) {
    ns.nuke(srv.hostName);
    ns.tprint(`ERROR : --> Copie des fichiers ${scriptNames} sur le serveur ${srv.hostName} en cours ...`);
    ns.scp(scriptNames, srv.hostName);
    ns.tprint(`ERROR : Copie des fichiers ${scriptNames} sur le serveur ${srv.hostName} TERMINE !`);
}

