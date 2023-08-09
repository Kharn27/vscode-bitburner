import { Work } from '/obj/enumWork';
import { ServerData } from '/obj/serverInterfaces';

export class WorkTask {

  constructor(private work: Work, private targetSrv: ServerData, private runnerSrv: ServerData, private thread: number) {
    this.work = work;
    this.targetSrv = targetSrv;
    this.runnerSrv = runnerSrv;
    this.thread = thread;
  }

  run = (ns:NS): void => {
    ns.exec(this.work, this.runnerSrv.hostName, this.thread, this.targetSrv.hostName);
  }
  

}