import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    const unit = 2;

    for (let i = 1; i <= 20; i++) {
        ns.tprintf(`Server de ${unit} ** ${i} (${unit ** i} Go) : ${ns.nFormat(ns.getPurchasedServerCost(unit ** i), "$0.000a")}`);
    }
}