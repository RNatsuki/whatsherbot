import { ProviderClass } from "../core/ProviderClass";
import { IncommingMessage } from "../core/types";
import { delay } from "../utils";
import { Flow } from "./types";



export class Bot {
  private provider: ProviderClass;
  private flows: Flow[] = [];

  constructor(provider: ProviderClass) {
    this.provider = provider;
    this.provider.on("message", this.handleMessage.bind(this));
  }

  private async handleMessage(message: IncommingMessage) {
    const {
      body,
      from,
      sender: { name },
    } = message;
    const data = { body, from, name };

    const flow = this.flows.find((flow) => {
      return flow.keywords.some((keyword: any) => {
        if (keyword instanceof RegExp) {
          return keyword.test(data.body);
        }

        if (typeof keyword === "object") {
          return keyword.some((k: any) => {
            if (k instanceof RegExp) {
              return k.test(data.body);
            }
            return data.body.includes(k);
          });
        }

        return data.body.includes(keyword);
      });
    });

    const sendResponse = (response: string) => {
      this.provider.sendMessage(from.split("@").shift() as string, response);
    };


    const sendImage = (media: string) => {
      this.provider.sendImage(from.split("@").shift() as string, media);
    }

    if (flow) {
      for (const action of flow.actions) {
        await action({ data, sendResponse, sendImage });
      }

      for (const answer of flow.answer) {
        this.provider.sendMessage(from.split("@").shift() as string, answer);
        await delay(800);
      }
    }
  }

  addFlow(flow: Flow[] | Flow) {
    if (Array.isArray(flow)) {
      flow.forEach((f) => {
        this.flows.push(f);
      });
      return;
    }

    this.flows.push(flow);
  }
}
