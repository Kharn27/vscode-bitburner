
export const execNames: string[] = ['brutessh.exe', 'ftpcrack.exe', 'relaysmtp.exe', 'httpworm.exe', 'sqlinject.exe'];
export const scriptNames: string[] = ["/bin/grow.js", "/bin/hack.js", "/bin/weak.js", "lib/constants.js"];
export const scriptRam: number[] = [4];

export const FOO_PORT = "NULL PORT DATA";
export const PORT_G = 1;
export const PORT_H = 2;
export const PORT_W = 3;
export const PORT_NEWBOT = 4;

export const minSecThreshold = 5;
export const minMoneyThreshold = 0.75;

export const weakedSrv = new Set<string>();
export const hackedSrv = new Set<string>();
export const growedSrv = new Set<string>();
export const freeRunner = new Set<string>();

export const initLog = (ns: NS): void => {
    const logsToDisable = ['getHackingLevel', 'scan', 'sleep', 'scp', 'nuke'];

    logsToDisable.forEach(log => ns.disableLog(log));
}
// /** working progress */
// export const nsServers: Map<string, ServerData> = new Map();
// export const serversToWeaken: AsyncBlockingQueue<ServerData> = new AsyncBlockingQueue();



