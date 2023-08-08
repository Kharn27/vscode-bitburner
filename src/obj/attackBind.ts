export class AttackBind {

    constructor(private fileName:string) {
        this.fileName = fileName;
    }

    get file(): string {
        return this.fileName;
    }
}