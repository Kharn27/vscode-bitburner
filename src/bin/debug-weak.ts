import { NS } from '@ns'

/**
 * Executes the main function.
 *
 * @param {NS} ns - The NS object containing Netscript instance.
 */
export async function main(ns: NS): Promise<void> {

    const server = <string>ns.args[0];
    const weakDebug = new Promise<number>((resolve, reject) => {
        try {
            resolve(ns.weaken(server));
        } catch (e) {
            reject(e);
        }
    });


    // listen to promise resolution
    await weakDebug.then((value) => {
        // (parameter) value: number
        ns.toast(`Weak ${server} return ${value}`, "success", 5000);
    }).catch((error) => {
        // (parameter) error: any
        ns.toast(`Weak ${server} failed ${error}`, "error");
    }).finally(() => {
        ns.tprintf(`Weak ${server} Completed!`);
    });

}