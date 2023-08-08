import { NS } from '@ns'

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
        ns.toast(`Grow ${server} return ${value}`, "success", 5000);
    }).catch((error) => {
        // (parameter) error: any
        ns.toast(`Grow ${server} failed ${error}`, "error");
    }).finally(() => {
        ns.tprintf(`Grow ${server} Completed!`);
    });

    ns.tprint("Script completed!");

}