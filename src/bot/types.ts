
export interface ActionContext {
  data: { body: string, from: string, name: string };
  sendResponse: (response: string) => void;
  sendImage: (media: string) => void;
  goToFlow: (flow: string | Flow ) => void;
}

export type flowAction = (context: ActionContext) => void;

export interface Flow {
  id: string;
  keywords: (string | RegExp)[];
  answer: string[];
  actions: CallableFunction[];
  addKeyword: (
    keywords: string | string[] | RegExp | RegExp[] | (string | RegExp)[]
  ) => Flow;
  addAnswer: (answer: string | string[]) => Flow;
  addAction: (callback: flowAction) => Flow;
}

export type Keywords = string | string[] | RegExp | RegExp[] | (string | RegExp)[];
