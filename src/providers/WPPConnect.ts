import { EVENTS } from "../core/events";
import { ProviderClass } from "../core/ProviderClass";
import { create, Whatsapp, defaultLogger } from "@wppconnect-team/wppconnect";

defaultLogger.transports.forEach((t) => (t.silent = true));

type events = "ready" | "qr";

export class WPPConnect extends ProviderClass {
  private client: Whatsapp | null = null;
  private clientIsReady: Promise<void>;
  // This is a constructor that calls the constructor of the ProviderClass
  constructor() {
    super(); // This is the constructor of the ProviderClass
    this.clientIsReady = this.init(); //Client is ready when init is called
  }

  /**
   * @description This function initializes the client is abstracted from the ProviderClass
   * @returns Promise<void>
   */
  async init(): Promise<void> {
    try {
      //@ts-ignore
      this.client = await create({
        session: "my-session",
        headless: "shell",
        logQR: false,
        puppeteerOptions: this.puppeteerOptions,
        catchQR: (_, ascii) => {
          this.emit("qr", ascii);
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
  /**
   *
   * @param phone the phone number to send the message
   * @param data  the message to send (text)
   */
  async sendMessage(phone: number, data: string): Promise<void> {
    await this.clientIsReady;

    if (!this.client) {
      throw new Error("Client is not ready");
    }

    await this.client?.sendText(`${phone}@c.us`, data);
  }
  /**
   *
   * @param phone the phone number to send the image
   * @param url the url of the image or the path of the image
   * @param text the text to send with the image
   */
  async sendImage(phone: number, url: URL | string): Promise<void> {
    await this.clientIsReady;

    if (!this.client) {
      throw new Error("Client is not ready");
    }

    await this.client.sendImage(`${phone}@c.us`, url.toString());
  }

  private puppeteerOptions = {
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      //"--single-process", // <- this one doesn't works in Windows
      "--disable-gpu",
    ],
  };
}
