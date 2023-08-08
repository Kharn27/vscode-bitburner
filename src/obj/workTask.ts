import { Work } from '/obj/enumWork';
import { ServerData } from '/obj/serverInterfaces';

export class WorkTask {
  private work: Work;
  private targetSrv: ServerData;

  constructor(work: Work, targetSrv: ServerData) {
    this.targetSrv = targetSrv;
    this.work = work;
  }

}