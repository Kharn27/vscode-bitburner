import { NS, Server } from "@ns";
import { multiScan } from "/fcn/netTools";

export interface ServerHardware {
    maxRam: number
    freeRam: number
    usedRam: number
    cores: number
}

export interface ServerPort {
    required: number
    open: number
    http: boolean
    ftp: boolean
    smtp: boolean
    sql: boolean
    ssh: boolean
}

export interface ServerMoney {
    available: number
    max: number
    growth: number
    actualPercent: number,
    actualRatio: number
}

export interface ServerSecurity {
    secLvl: number
    base: number
    min: number
}

export class ServerData {

    constructor(public ns: NS, public hostName = "", public isFoo = false) {
        this.ns = ns;
        this.hostName = hostName;
        this.isFoo = hostName === "";
    }

    get data(): Server { return this.ns.getServer(this.hostName) }
    get ip(): string { return this.data.ip }
    get connected(): boolean { return this.data.isConnectedTo }
    get hackable(): boolean { return this.data.requiredHackingSkill <= this.ns.getHackingLevel() }
    get rooted(): boolean { return this.data.hasAdminRights }
    get backdoored(): boolean { return this.data.backdoorInstalled }
    get orga(): string { return this.data.organizationName }
    get isPurchased(): boolean { return this.data.purchasedByPlayer && this.data.hostname !== 'home' }
    get hackSkill(): number { return this.data.requiredHackingSkill }

    /**
    * Retrieves the correct value of the `moneyAvailable` property for growAnalyse.
    * If moneyAvailable === 0, it should be considered as 1 for growAnalyse
    *
    * @return {number} The value of the `growTricks` property.
    */
    get growTricks(): number {
        const m = this.data.moneyAvailable;
        if (m > 0) {
            return m;
        } else {
            return 1;
        }

    }

    get hardware(): ServerHardware {
        return {
            usedRam: this.data.ramUsed,
            maxRam: this.data.maxRam,
            freeRam: this.data.maxRam - this.data.ramUsed,
            cores: this.data.cpuCores
        }
    }

    get money(): ServerMoney {
        return {
            available: this.growTricks,
            max: this.data.moneyMax,
            growth: this.data.serverGrowth,
            actualPercent: this.growTricks / this.data.moneyMax,
            actualRatio: 1 / (this.growTricks / this.data.moneyMax)
        }
    }

    get sec(): ServerSecurity {
        return {
            base: this.data.baseDifficulty,
            min: this.data.minDifficulty,
            secLvl: this.data.hackDifficulty
        }
    }

    get ports(): ServerPort {
        return {
            required: this.data.numOpenPortsRequired,
            open: this.data.openPortCount,
            http: this.data.httpPortOpen,
            ftp: this.data.ftpPortOpen,
            smtp: this.data.smtpPortOpen,
            sql: this.data.sqlPortOpen,
            ssh: this.data.sshPortOpen
        }
    }

    isNewTarget(rootforce: number): boolean {
        return this.hackable && !this.rooted && this.ports.required <= rootforce && !this.isPurchased
    }

    availableThread(scriptRamUsage: number): number {
        let freeRam = 0;
        if (this.hostName === 'home') {
            freeRam = this.hardware.freeRam - Math.round(this.hardware.maxRam / 10);
            freeRam = freeRam < 0 ? 0 : freeRam;
        } else {
            freeRam = this.hardware.freeRam;
        }
        return Math.floor(freeRam / scriptRamUsage);
    }

    secDiff(): number {
        return this.sec.secLvl - this.sec.min;
    }

    weakForce(ramNeed: number): number {
        return this.ns.weakenAnalyze(this.availableThread(ramNeed), this.hardware.cores);
    }

    getThreadForWeaken(ramNeeded: number, secDiff: number): number {
        const ratio = secDiff / this.weakForce(ramNeeded);
        return Math.ceil(ratio * this.availableThread(ramNeeded));
    }


    toJSON(): string { return JSON.stringify(this.data) }


    static getServerNamesList(ns: NS, server = 'home', serverList = new Set<string>()): string[] {
        let serverConnections: string[] = ns.scan(server);
        ns.printf("Scanning server : " + server);
        serverConnections = serverConnections.filter(s => !serverList.has(s));
        serverConnections.forEach(s => {
            // if (s !== 'home') {
            serverList.add(s);
            // }
            return multiScan(ns, s, serverList);
        });
        return Array.from(serverList);
    }


    static getServers(ns: NS): ServerData[] {
        const servers: ServerData[] = [];
        multiScan(ns).forEach(srv => {
            const serverData = new ServerData(ns, srv);
            servers.push(serverData);
        })
        return servers;
    }


    static getServerList(ns: NS): Set<ServerData> {
        const servers: Set<ServerData> = new Set();
        multiScan(ns).forEach(srv => {
            const serverData = new ServerData(ns, srv);
            servers.add(serverData);
        })
        return servers;
    }

    static getTargetableServers(ns: NS): ServerData[] {
        return ServerData.getServers(ns).filter(srv => srv.money.max > 0 && srv.rooted);
    }

    static getRunnerServer(ns: NS, withHome = true): ServerData[] {
        return ServerData.getServers(ns).filter(srv => srv.rooted && (withHome || srv.hostName !== 'home') && srv.hardware.maxRam > 0);
    }

}


/** 
    * @param {NS} ns - L'interface NetScript
    * @param {Set} serverList - La liste des serveurs parcourus
 **/
export function getBestServer(ns: NS, serverList: Set<ServerData>, log = false): ServerData {
    let server: ServerData = new ServerData(ns);
    let maxMoney = 0;
    ns.disableLog("getHackingLevel");
    const myHackingLvl = ns.getHackingLevel();
    serverList.forEach(srv => {
        if (log) ns.tprintf("Server %s:%s has %s max with required hack Level %d : mine %d ", srv.hostName, srv.ip, ns.nFormat(srv.money.max, "$0.000a"), srv.hackSkill, myHackingLvl);
        if (maxMoney < srv.money.max && srv.hackSkill <= Math.round(myHackingLvl / 2) && srv.rooted) {
            maxMoney = srv.money.max;
            server = srv;
        }
    })
    return server;
}

