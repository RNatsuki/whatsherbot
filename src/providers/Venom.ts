import { ProviderClass } from "../core/ProviderClass";
import { create, Whatsapp } from "venom-bot";
import axios from "axios";
export class Venom extends ProviderClass {
  private client: Whatsapp | null = null;
  private clientIsReady: Promise<void>;

  constructor() {
    super();
    this.clientIsReady = this.init();
  }

  async init(): Promise<void> {
    try {
      this.client = await create({
        session: "my-session",
        logQR: false,
        catchQR: (_, asciiQR) => {
          this.emit("qr", asciiQR);
        },
      });
      this.emit("ready");
      this.client.onMessage((message) => {
        this.emit("message", { ...message });
      });

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async sendMessage(phone: string, data: string): Promise<void> {
    await this.clientIsReady;

    if (!this.client) {
      throw new Error("Client is not ready");
    }

    await this.client?.sendText(`${phone}@c.us`, data);
  }
  async sendImage(phone: string, url: URL | string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
