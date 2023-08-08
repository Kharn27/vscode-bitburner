import { Server } from '@ns';

export async function main(ns: NS): Promise<void> {
    const server = 'foodnstuff';
    const serverData: Server = _ns('getServer', server);
    _ns('tprint', serverData);


    /**
     * Evades both static and dynamic RAM calculations.
     * 
     * @link https://www.reddit.com/r/Bitburner/comments/syi865/script_ram_cost_bugs_exploits_and_silver_linings/
     * 
     * @param   {string}  method  Any function of ns.
     * @param   {unknown}     [args]  Optional. Arguments to be passed to the function.
     * 
     * @return  {any}             The return value of the method called.
     */
    function _ns(method: string, ...args: unknown[]) {
        const call = () => eval("ns." + method)(...args);
        try {
            return call();
        } catch {
            return call();
        }
    } // end of function _ns
}