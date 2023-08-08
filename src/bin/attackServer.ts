import { NS } from '@ns'

/** 
 * @param {NS} ns - L'interface NetScript
*/
export async function main(ns: NS): Promise<void> {
	const server: string = <string>ns.args[0];
	if (server == null) {
		throw new Error("Specify the server to rock !");
	}
	const serverData = ns.getServer(server);
	if (ns.fileExists('brutessh.exe')) {
		await ns.brutessh(server);
		ns.print("Server : " + server + "-> BruteSSH OK");
	}

	if (ns.fileExists('ftpcrack.exe')) {
		await ns.ftpcrack(server);
		ns.print("Server : " + server + "-> FTPCrack OK")
	}

	if (ns.fileExists('relaysmtp.exe')) {
		await ns.relaysmtp(server);
		ns.print("Server : " + server + "-> relaySMTP OK")
	}
	if (ns.fileExists('httpworm.exe')) {
		await ns.httpworm(server);
		ns.print("Server : " + server + "-> HTTPWorm OK")
	}
	if (ns.fileExists('sqlinject.exe')) {
		await ns.sqlinject(server);
		ns.print("Server : " + server + "-> SQLInject OK")
	}
	if (ns.getServerNumPortsRequired(server) <= serverData.openPortCount) {
		await ns.nuke(server);
		ns.print("**** CONGRATS !! " + server + " is now ROOTED !")
	}

	// if (!serverData.backdoorInstalled) {
	// 	ns.installBackdoor(server);
	// }
}