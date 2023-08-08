
/** 
 * @param {NS} ns - L'interface NetScript
 * @param {string} server - Le serveur à scanner
 * @param {Set} serverList - La liste des serveurs parcourus
 * **/
export function multiScan(ns: NS, server = 'home', serverList = new Set<string>()): string[] {
    let serverConnections: string[] = ns.scan(server);
    serverConnections = serverConnections.filter(s => !serverList.has(s));
    serverConnections.forEach(s => {
        // if (s !== 'home') {
        serverList.add(s);
        // }
        return multiScan(ns, s, serverList);
    });
    return Array.from(serverList);
}
