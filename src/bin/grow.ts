import { NS } from '@ns'

/**
 * Executes the main function.
 *
 * @param {NS} ns - The NS object containing Netscript instance.
 */
export async function main(ns: NS): Promise<void> {
    await ns.grow(<string>ns.args[0]);
}