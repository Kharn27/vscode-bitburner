import { Queue } from "/obj/queue";
import { ServerData } from "/obj/serverInterfaces";

export const execNames: string[] = ['brutessh.exe', 'ftpcrack.exe', 'relaysmtp.exe', 'httpworm.exe', 'sqlinject.exe'];
export const scriptNames: string[] = ["/bin/grow.js", "/bin/hack.js", "/bin/weak.js"];
export const scriptRam: number[] = [3];


/** working progress */
export const nsServers: Map<string, ServerData> = new Map();

export const serversToWeaken: Queue<ServerData> = new Queue();



