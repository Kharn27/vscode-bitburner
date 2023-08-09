import { NS } from '@ns';
import { growedSrv, hackedSrv, initLog, minMoneyThreshold, minSecThreshold, scriptNames, scriptRam, weakedSrv } from '/lib/constants';
import { ServerData } from '/obj/serverInterfaces';

export async function main(ns: NS): Promise<void> {
    initLog(ns);

    while (true) {

        let isFullOfWork = false;
        let serversToAttack = [];

        ns.tprint(`Liste des servers targetable : ${JSON.stringify(ServerData.getTargetableServers(ns).map(srv => srv.hostName))}`);
        ns.tprint(`Liste des servers en cours de weaking : ${JSON.stringify(Array.from(weakedSrv))}`);
        ns.tprint(`Liste des servers targetable WEAK : ${JSON.stringify(ServerData.getTargetableServers(ns).filter(srv => !weakedSrv.has(srv.hostName) && srv.secDiff() > minSecThreshold).map(srv => srv.hostName))}`);
        ns.tprint(`Liste des servers en cours de hacking : ${JSON.stringify(Array.from(hackedSrv))}`);
        ns.tprint(`Liste des servers targetable HACK : ${JSON.stringify(ServerData.getTargetableServers(ns).filter(srv => !hackedSrv.has(srv.hostName) && srv.money.actualPercent >= minMoneyThreshold && ns.hackAnalyzeChance(srv.hostName) > 0.97).map(srv => srv.hostName))}`);
        ns.tprint(`Liste des servers en cours de grow : ${JSON.stringify(Array.from(growedSrv))}`);
        ns.tprint(`Liste des servers targetable GROW : ${JSON.stringify(ServerData.getTargetableServers(ns).filter(srv => !growedSrv.has(srv.hostName) && srv.money.actualPercent < minMoneyThreshold).map(srv => srv.hostName))}`);
        
        // Récupération des servers à cibler qui ne sont pas déja en train d'etre weaked
        serversToAttack = ServerData.getTargetableServers(ns).filter(srv => !weakedSrv.has(srv.hostName) && srv.secDiff() > minSecThreshold);

        // Si il y a des servers à weaker
        if (serversToAttack.length !== 0) {
            // Pour chaque server à weaker
            for (const srvIdx in serversToAttack) {
                const srv: ServerData = serversToAttack[srvIdx];

                // On calcule la diff de sécurité à diminuer
                let diffToWeak = srv.secDiff();

                // On récupère la liste des runners
                const runners = ServerData.getRunnerServer(ns).filter(runSrv => runSrv.weakForce(scriptRam[2]) > 0);

                let pSrv = 0;
                while (pSrv < runners.length && diffToWeak > 0) {
                    const runSrv = runners[pSrv];
                    const weakForce = runSrv.weakForce(scriptRam[2]);
                    if (weakForce <= diffToWeak) {
                        ns.exec(scriptNames[2], runSrv.hostName, runSrv.availableThread(scriptRam[2]), srv.hostName);
                        diffToWeak -= weakForce;
                    } else {
                        const thread = runSrv.getThreadForWeaken(scriptRam[2], diffToWeak);
                        ns.exec(scriptNames[2], runSrv.hostName, thread, srv.hostName);
                        diffToWeak = 0;
                    }
                    pSrv++;
                }
                // On ajoute coute que coute le server a la liste des "en cours de weaking"
                weakedSrv.add(srv.hostName);
                if (diffToWeak > 0) {
                    ns.toast(`Weak ${srv.hostName} : Pas de runner disponible!!!`, "error", 5000);
                    isFullOfWork = true;
                    break;
                }
            }
        } 

        // Plus aucun thread de dispo pour sécher un serveur, inutile de checker le reste
        if (isFullOfWork) {
            ns.printf(`WARNING : Full of charge !! Nothing to do !!`);
            await ns.sleep(2000);
            ns.tprint(`***************************************************************`);
            continue;
        }

        // Récupération des servers à cibler qui ne sont pas déja en train d'etre growed
        serversToAttack = ServerData.getTargetableServers(ns).filter(srv => !growedSrv.has(srv.hostName) && srv.money.actualPercent < minMoneyThreshold);
        // Si il y a des servers à grower
        if (serversToAttack.length !== 0) {
            // Pour chaque server à grower
            for (const srvIdx in serversToAttack) {
                const srv: ServerData = serversToAttack[srvIdx];

                // On récupère la liste des runners
                const runners = ServerData.getRunnerServer(ns).filter(runSrv => runSrv.availableThread(scriptRam[0]) > 0);

                let pSrv = 0;
                let ratio = 0;

                while (pSrv < runners.length && ratio < 1) {
                    const runSrv = runners[pSrv];
                    // On calcule le nombre de thead pour rétablir 100% des tunes à partir du runner
                    const baseThreadCount = Math.ceil(ns.growthAnalyze(srv.hostName, srv.money.actualRatio, runSrv.hardware.cores));
                    // on prend en considération le ratio déja géré par d'autre runner
                    const realThreadCount = Math.ceil(baseThreadCount - (ratio * baseThreadCount));
                    // Combien le runner peut fournir de thread pour ce script
                    const avThread = runSrv.availableThread(scriptRam[0]);
                    //  on calcul le ratio de growing pris en charge
                    ratio = Math.floor(avThread / realThreadCount);

                    // Si le nombre de thread est inférieur au nombre de thread disponible, on prend le nombre de thread disponible
                    if (ratio < 1) {
                        ns.exec(scriptNames[0], runSrv.hostName, avThread, srv.hostName);
                    }
                    // Sinon, on prend le nombre de thread nécessaire
                    else {
                        ratio = 1;
                        ns.exec(scriptNames[0], runSrv.hostName, realThreadCount, srv.hostName);
                    }
                    pSrv++;
                }
                // On ajoute coute que coute le server a la liste des "en cours de growing"
                growedSrv.add(srv.hostName);

                if (ratio < 1) {
                    ns.toast(`Grow ${srv.hostName} : Pas de runner disponible!!!`, "error", 5000);
                    isFullOfWork = true;
                    break;
                }
            }
        } 
        

        // Plus aucun thread de dispo pour sécher un serveur, tempo suppl
        if (isFullOfWork) {
            ns.printf(`WARNING : Full of charge !! Nothing to do !!`);
            await ns.sleep(2000);
            ns.tprint(`***************************************************************`);
            continue;
        }


        // Récupération des servers à cibler qui ne sont pas déja en train d'etre hacked
        serversToAttack = ServerData.getTargetableServers(ns).filter(srv => !hackedSrv.has(srv.hostName) && srv.money.actualPercent >= minMoneyThreshold && ns.hackAnalyzeChance(srv.hostName) > 0.97);

        // Si il y a des servers à hacker
        if (serversToAttack.length !== 0) {
            ns.print(`Hacking ${serversToAttack.length} servers`);
            // Pour chaque server à hacker
            for (const srvIdx in serversToAttack) {
                const srv: ServerData = serversToAttack[srvIdx];
                const targetMoney = Math.floor(srv.money.available / 2);
                const baseHackThreadCount = Math.ceil(ns.hackAnalyzeThreads(srv.hostName, targetMoney));

                // On récupère la liste des runners
                const runners = ServerData.getRunnerServer(ns).filter(runSrv => runSrv.availableThread(scriptRam[1]) > 0);

                let pSrv = 0;
                let threadRestant = baseHackThreadCount;

                while (pSrv < runners.length && threadRestant > 0) {
                    const runSrv = runners[pSrv];
                    const avThread = runSrv.availableThread(scriptRam[1]);
                    if (avThread >= threadRestant) {
                        ns.exec(scriptNames[1], runSrv.hostName, threadRestant, srv.hostName);
                        threadRestant = 0;
                    } else {
                        ns.exec(scriptNames[1], runSrv.hostName, avThread, srv.hostName);
                        threadRestant = threadRestant - avThread;
                    }
                    pSrv++;
                }
                // On ajoute coute que coute le server a la liste des "en cours de hacking"
                hackedSrv.add(srv.hostName);

                if (threadRestant > 0) {
                    ns.toast(`Hack ${srv.hostName} : Pas de runner disponible!!!`, "error", 5000);
                    isFullOfWork = true;
                    break;
                }
            }
        } 

        // Plus aucun thread de dispo pour sécher un serveur, tempo suppl
        if (isFullOfWork) {
            ns.printf(`WARNING : Full of charge !! Nothing to do !!`);
            await ns.sleep(2000);
            ns.tprint(`***************************************************************`);
            continue;
        }

        ns.printf(`INFO : FREE !! Waiting for target !!`);
        ns.tprint(`***************************************************************`);
        await ns.sleep(2000)
    }
}