import { NS } from '@ns';

let _ns: NS;

const endOk = function () {
    console.log("Function !!!!!!!!!!! Terminated");
};

const endKo = function () {
    console.log("Function !!!!!!!!!!! ERROR");
};

const term = function (resolve: () => void, reject: () => void) {
    console.log("Function Terminated");
    resolve();
    reject()
}




export async function main(ns: NS): Promise<void> {
    /**************************************************** */
    // // resolve with an `even` integer
    // const findEven = new Promise<number>( ( resolve, reject ) => {
    //     setTimeout( function(): void {

    //         // convert `string` to `number`
    //         const value = parseInt( getRandomInt() );

    //         if( value % 2 === 0 ) {
    //             resolve( value );
    //         } else {
    //             reject( 'Odd number found : ' + value );
    //         }
    //     }, 1000 );
    // } );
    /**************************************************** */


    // resolve with an `even` integer
    const findEven = new Promise<unknown>((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(ns.tprint("Test Promise"));
            } catch (e) {
                reject(e);
            }
        }, 3000);
    });

    // listen to promise resolution
    await findEven.then((value) => {
        let result = "void"
        if (value) result = `${value}`;
        // (parameter) value: number
        ns.toast(`Resolved: ${result}`, "success");
    }).catch((error) => {
        // (parameter) error: any
        ns.toast('Rejected:', error);
    }).finally(() => {
        ns.toast('Completed!');
    });

    /**************************************************** */
    // await ns.weaken(<string>ns.args[0]);

    //
    // return (() => {
    //     console.log("Function Terminated");
    // })();

    // return (function(){
    //     console.log("Function Terminated");
    // })();

    // return endOk();
    /**************************************************** */
}