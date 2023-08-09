import { NS } from '@ns';
import { PORT_G } from '/lib/constants';


/**
 * Executes the main function.
 *
 * @param {NS} ns - The NS object containing Netscript instance.
 */
export async function main(ns: NS): Promise<void> {

    const server = <string>ns.args[0];
    const growDebug = new Promise<number>((resolve, reject) => {
        try {
            resolve(ns.grow(server));
        } catch (e) {
            reject(e);
        }
    });


    // listen to promise resolution
    await growDebug.then((value) => {
        // (parameter) value: number
        ns.print(`Grow ${server} return ${value}`);
    }).catch((error) => {
        // (parameter) error: any
        ns.toast(`Grow ${server} failed ${error}`, "error");
    }).finally(() => {
        ns.writePort(PORT_G, server);
    })

}