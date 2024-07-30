import { Flow } from "./types";


export enum EVENTS {
  WELCOME = "welcome-event-response-all-keywords",
}

export class FlowImp implements Flow {
  id: string;
  keywords: (string | RegExp)[];
  answer: string[];
  actions: CallableFunction[];

  constructor(id: string) {
    this.id = id;
    this.keywords = [];
    this.answer = [];
    this.actions = [];
  }

  addKeyword(
    keywords: string | string[] | RegExp | RegExp[] | (string | RegExp)[]
  ): Flow {
    this.keywords = Array.isArray(keywords) ? keywords : [keywords];
    return this;
  }

  addAnswer(answer: string | string[]): Flow {
    this.answer = Array.isArray(answer) ? answer : [answer];
    return this;
  }

  addAction(callback: CallableFunction): Flow {
    this.actions.push(callback);
    return this;
  }
}
