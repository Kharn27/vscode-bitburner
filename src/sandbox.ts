import { NS } from '@ns';
import { ServerData } from './obj/serverInterfaces';
import { ServerBuyer } from '/serverBuyerDaemon';
import { PORT_G, PORT_H, PORT_W } from '/lib/constants';

const scriptNames: string[] = ["/bin/grow.js", "/bin/hack.js", "/bin/weak.js"];
const scriptRam: number[] = [3];

/**
 * The main function of the program.
 *
 * @param {NS} ns - The namespace object.
 */
export async function main(ns: NS): Promise<void> {

    const serverToHack: Set<string> = new Set();
    const serverRooted: Set<string> = new Set();
    const servers: Set<ServerData> = ServerData.getServerList(ns);

    // const asyncQueue: AsyncBlockingQueue<ServerData> = new AsyncBlockingQueue();
    // const rootSrvWatchdog = new RootableSrvWatchDog(ns, asyncQueue);
    // // await rootSrvWatchdog.run();
    // setTimeout(await rootSrvWatchdog.run, 2000);

    // asyncQueue.enqueue(new ServerData(ns, "home"));



    // const stringQueue = new Queue<string>();
    // const voidFnQueue = new Queue<() => void>();
    // const numFnQueue = new Queue<() => number|PromiseLike<number>>();
    // const advFnQueue = new Queue<(serverName:string) => number|PromiseLike<number>>();
    // const execQueue = new Queue<(scriptName:string, runnerName:string, threads:number, targetName: string) => number>();

    // const executorString = new Executor(stringQueue);
    // const executorVoidFunc = new Executor(voidFnQueue);
    // const executorNumFunc = new Executor(numFnQueue);
    // const executorAdvFunc = new Executor(advFnQueue);
    // const executorExecFunc = new Executor(execQueue);
    const runner = new ServerData(ns, 'home');
    const myServer = new ServerData(ns, 'neo-net');

    for (const i in scriptNames) {
        const s = scriptNames[i];
        scriptRam[i] = ns.getScriptRam(s);
        ns.tprint(`Ram usage for ${s} : ${scriptRam[i]}`);
    }

    const growFile: Set<string> = new Set();
    const hackFile: Set<string> = new Set();
    const weakFile: Set<string> = new Set();

    ns.writePort(PORT_G, "message1");
    ns.writePort(PORT_G, "message2");
    ns.writePort(PORT_G, "message3");
    ns.tprint(`Premier ReadPort : ${ns.readPort(PORT_G)}`);
    ns.tprint(`Second ReadPort : ${ns.readPort(PORT_G)}`);
    // growFile.add(runner.hostName)
    // ns.writePort(GROWP, JSON.stringify(Array.from(growFile)));
    // ns.writePort(HACKP, JSON.stringify(hackFile));
    // ns.writePort(WEAKP, JSON.stringify(weakFile));

    // growFile.add(myServer.hostName);
    // ns.tprint(`Taille de growfile : ${growFile.size}`);
    // cJSON.stringify(Array.from(growFile)));
    // console.log(ns.readPort(GROWP));
    // ns.tprint(`${ns.readPort(GROWP)}`);
    // ns.tprint(`${ns.readPort(GROWP)}`);
    ns.exec("bin/debug-grow.js", runner.hostName, 100, myServer.hostName);

    await ns.sleep(10000);


    // const myServer = new ServerData(ns);
    // const nD = new ServerData(ns, 'n00dles');

    // ns.tprint(`${myServer.isFoo}`);
    // ns.tprint(`${nD.isFoo} blablabla ${JSON.stringify(nD)}`);
    // ns.tprint(ServerData);
    // ns.exec("bin/weakEv.js", 'home', 1, myServer.hostName);

    //********************************************************************************** */
    // ns.tprintf("Hacking time %d", ns.formulas.hacking.hackTime(ns.getServer(myServer.hostName), ns.getPlayer()));
    // while (true) {
    //     ns.tprintf(`${myServer.hostName} \n Ram Info  ${JSON.stringify(myServer.hardware)}`);
    //     ns.tprintf(`${myServer.hostName} hack Info  ${JSON.stringify(myServer.sec)}`);
    //     ns.tprintf(`${myServer.hostName} money Info  ${JSON.stringify(myServer.money)}`);
    //     await ns.sleep(3000);
    // }
    //*********************************************************************************** */
    const cores = 10;
    const growMultiplier = 2;

    ns.tprintf(`INFO : \t${myServer.hostName} Ram Info\t${JSON.stringify(myServer.hardware)}
        ${myServer.hostName} hack Info\t${JSON.stringify(myServer.sec)}
        ${myServer.hostName} money Info\t${JSON.stringify(myServer.money)}`);
    // for (let thread = 1; thread <= 5; thread++) {
    //     ns.tprint(`${myServer.hostName} thread:${thread} cores:${cores}
    //     \t WeakenAnalyse ${ns.weakenAnalyze(thread, cores)}
    //     \t GrowAnalyse ${ns.growthAnalyze(myServer.hostName, 2)} 
    //     \t GrowAnalyseSecure ${ns.growthAnalyzeSecurity(thread, myServer.hostName, cores)}`);
    // }
    ns.tprint(`Diff to weak ${myServer.secDiff()}`);
    ns.tprint(`Serveur cash à ${myServer.money.actualPercent * 100}%`);
    ns.tprint(`Multiplicateur nécessaire ${myServer.money.actualRatio}`);
    ns.tprint(`Nombre de Thread pour rétablir 100% de l'argent From home: ${Math.ceil(ns.growthAnalyze(myServer.hostName, myServer.money.actualRatio, runner.hardware.cores))}`);
    ns.tprint(`Nombre de Thread pour rétablir 100% de l'argent From himself: ${Math.ceil(ns.growthAnalyze(myServer.hostName, myServer.money.actualRatio, myServer.hardware.cores))}`);
    ns.tprint(`Nombre de thread pour voler ${ns.nFormat(Math.floor(myServer.money.available / 2), "$0.000a")} : ${Math.ceil(ns.hackAnalyzeThreads(myServer.hostName, Math.floor(myServer.money.available / 2)))} thread(s)`);
    ns.tprint(`Money Hack for one Thread ${ns.hackAnalyze(myServer.hostName) * 100}%`);
    ns.tprint(`Money Hack for 150 Thread ${ns.hackAnalyze(myServer.hostName) * 100 * 150}%`);
    ns.tprint(`HackTime for for server ${myServer.hostName} : ${ns.getHackTime(myServer.hostName)}ms`);
    ns.tprint(`Chance to Hack ${ns.hackAnalyzeChance(myServer.hostName) * 100}%`);
    ns.tprint(`WeakenForce for one thread ${runner.weakForce(scriptRam[2])}`);
    ns.tprint(`WeakenForce for server Home (${runner.availableThread(scriptRam[2])} thread(s)) ${runner.weakForce(scriptRam[2])}`);
    ns.tprint(`WeakenForce for server ${myServer.hostName} (${myServer.availableThread(scriptRam[2])} thread(s)) ${myServer.weakForce(scriptRam[2])}`);
    ns.tprint(`WeakenTime for server ${myServer.hostName} : ${ns.getWeakenTime(myServer.hostName)} ms`);


    const daemonTest = new ServerBuyer();

    await daemonTest.run(ns);



    // stringQueue.enqueue("stringQueue Test");
    // ns.tprint(executorString.test());

    // voidFnQueue.enqueue(() =>ns.tprint("Transmission fonction Test"));
    // executorVoidFunc.test()();

    // numFnQueue.enqueue(() => ns.weaken("neo-net"));
    // await executorNumFunc.test()();

    // advFnQueue.enqueue((serverName) => ns.weaken(serverName));
    // await executorAdvFunc.test()('neo-net');

    // ns.exec(scriptNames[2], srvRunner.hostName, availableThread, targetServer.hostName);

    // execQueue.enqueue((scName, runName, thr, targetName) => ns.exec(scName, runName, thr, targetName));
    // executorExecFunc.test()(scriptNames[0], 'home', 1, myServer.hostName);


    ns.toast("Sandbox Terminée", "success", 5000);

}


// /**
//  * @param {string} key
//  * @return {any} The value read from localStorage
//  * @cost 0 GB
//  **/
// export function getLSItem(key: string): unknown | undefined {
//     const item = localStorage.getItem(lsKeys[key.toUpperCase()])

//     return item ? JSON.parse(item) : undefined
// }

// /**
//  * @param {string} key
//  * @param {any} value
//  * @cost 0 GB
//  **/
// export function setLSItem(key: string, value:unknown): void {
//     localStorage.setItem(lsKeys[key.toUpperCase()], JSON.stringify(value))
// }

// /**
//  * @param {string} key
//  * @cost 0 GB
//  **/
// export function clearLSItem(key:string): void {
//     localStorage.removeItem(lsKeys[key.toUpperCase()])
// }



// export const lsKeys = {
//     NMAP : 'jh_network_map',
//     PLAYER : 'jh_player',
//     RESERVE : 'jh_reserve',
//     BITNODE : 'jh_bn_multipliers',
//     SOURCEFILES : 'jh_owned_sourcefiles',
//     WORKING : 'jh_working',
//     DECOMMISSIONED : 'jh_decommissioned',
//     HACKPERCENT : 'jh_hack_percent',
//     CLASHTIME : 'jh_next_territory_warefare',
//     GANGMETA : 'jh_gang_information',
//     SLEEVEMETA : 'jh_sleeve_information',
//   }