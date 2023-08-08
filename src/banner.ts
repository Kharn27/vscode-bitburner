import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    const doc = eval('document');
    // doc.getElementById("root")
    //     .insertAdjacentHTML('beforeend', `<li><p color=red><img src="https://thumbs.dreamstime.com/z/matrix-digits-background-numbers-laptop-eye-106780751.jpg?w=1600"></img></p></li>`);

    doc.getElementById("terminal").insertAdjacentHTML('beforeend', `<li><p color=red><img src="https://thumbs.dreamstime.com/z/matrix-digits-background-numbers-laptop-eye-106780751.jpg?w=1600"></img></p></li>`)
}