import { NS } from '@ns';

export async function main(ns: NS): Promise<void> {
    const doc = eval('document');
    
    await ns.wget("https://api.thecatapi.com/v1/images/search", "json.txt");
    const content = await ns.read("json.txt");
    const url = JSON.parse(content)[0]["url"];
    await ns.write(<string>ns.args[0], '<html><body><img src="' + url + '"></img></body></html>'
    , "w");

	doc.getElementById("terminal")
    .insertAdjacentHTML('beforeend', `<li><p color=red><img src="${url}"></img></p></li>`)
}