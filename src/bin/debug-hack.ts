import { NS } from '@ns'

/**
 * Executes the main function.
 *
 * @param {NS} ns - The NS object containing Netscript instance.
 */
export async function main(ns: NS): Promise<void> {

    const server = <string>ns.args[0];
    const hackDebug = new Promise<number>((resolve, reject) => {
        try {
            resolve(ns.hack(server));
        } catch (e) {
            reject(e);
        }
    });

    // listen to promise resolution
    await hackDebug.then((value) => {
        // (parameter) value: number
        ns.toast(`Hack ${server} get Money ${ns.nFormat(value, "$0.000a")}`, "success", 5000);
    }).catch((error) => {
        // (parameter) error: any
        ns.toast(`Hack ${server} failed ${error}`, "error");
    }).finally(() => {
        ns.tprintf(`Hack ${server} Completed!`);
    });

}