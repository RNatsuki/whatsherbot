import { EventEmitter } from "node:events";
import { EVENTS } from "./events";
import { IncommingMessage } from "./types";

abstract class ProviderClass extends EventEmitter {
  constructor() {
    super();
    this.eventHandler();
  }

  private eventHandler() {
    this.on(EVENTS.READY, this.handleReady);
    this.on(EVENTS.MESSAGE, this.handleIncomingMessage);
    this.on(EVENTS.QR, this.handleQR);
  }

  private handleReady() {
    console.log("Provider is ready");
  }

  private handleIncomingMessage({
    body,
    from,
    sender: { name },
  }: IncommingMessage) {}

  private handleQR(qr: string) {
    console.log(qr);
  }

  abstract init(): Promise<any>;
  abstract sendMessage(phone: string, data: string): void;
  abstract sendImage(phone: string, url: URL | string): Promise<void>;
}

export { ProviderClass };
