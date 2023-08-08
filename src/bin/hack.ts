import { NS } from '@ns'

/**
 * Executes the main function asynchronously.
 *
 * @param {NS} ns - The NS object representing the Netscript instance.
 */
export async function main(ns: NS): Promise<void> {
    await ns.hack(<string>ns.args[0]);
}