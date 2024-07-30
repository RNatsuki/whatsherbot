import { ProviderClass } from "../core/ProviderClass";
import { IncommingMessage } from "../core/types";
import { delay } from "../utils";
import { EVENTS } from "./flow";
import { Flow } from "./types";

export class Bot {
  private provider: ProviderClass;
  private flows: Flow[] = [];
  private isFlowActive: boolean = false;
  private messageQueue: IncommingMessage[] = [];

  constructor(provider: ProviderClass) {
    this.provider = provider;
    this.provider.on("message", this.handleMessage.bind(this));
  }

  private async handleMessage(message: IncommingMessage) {
    if (this.isFlowActive) {
      this.messageQueue.push(message);
      return;
    }

    this.isFlowActive = true;

    const data = this.extractDataFromMessage(message);
    const flow = this.findMatchingFlow(data.body) || this.flows.find(flow => flow.keywords.includes(EVENTS.WELCOME));

    if (flow) {
      await this.executeFlowActions(flow, data as any);
      await this.sendFlowAnswers(flow, data.from as any);
    }

    this.isFlowActive = false;
    this.processQueue();
  }

  private processQueue() {
    if (this.messageQueue.length > 0) {
      const nextMessage = this.messageQueue.shift();
      this.handleMessage(nextMessage!);
    }
  }

  private extractDataFromMessage(message: IncommingMessage) {
    const { body, from, sender: { name } } = message;
    return { body, from: from.split("@").shift(), name };
  }

  private findMatchingFlow(body: string) {
    return this.flows.find(flow => flow.keywords.some(keyword => this.keywordMatches(keyword, body)));
  }

  private keywordMatches(keyword: any, body: string): boolean {
    if (keyword instanceof RegExp) {
      return keyword.test(body);
    }
    if (Array.isArray(keyword)) {
      return keyword.some(k => this.keywordMatches(k, body));
    }
    return body.includes(keyword);
  }

  private async executeFlowActions(flow: Flow, data: { body: string, from: string, name: string }) {
    const sendResponse = (response: string) => this.provider.sendMessage(data.from, response);
    const sendImage = (media: string) => this.provider.sendImage(data.from, media);
    const goToFlow = (flowId: string | Flow) => this.goToFlow(typeof flowId === "string" ? flowId : flowId.id, data);

    for (const action of flow.actions) {
      await action({ data, sendResponse, sendImage, goToFlow });
    }
  }

  private async sendFlowAnswers(flow: Flow, from: string) {
    for (const answer of flow.answer) {
      this.provider.sendMessage(from, answer);
      await delay(800);
    }
  }

  private goToFlow(flowId: string, data: { body: string, from: string, name: string }) {
    const flow = this.flows.find(flow => flow.id === flowId);
    if (flow) {
      this.executeFlowActions(flow, data);
      this.sendFlowAnswers(flow, data.from);
    }
  }

  addFlow(flow: Flow[] | Flow) {
    if (Array.isArray(flow)) {
      this.flows.push(...flow);
    } else {
      this.flows.push(flow);
    }
  }
}
