import { createFlow, Bot } from "./bot";
import { ProviderClass } from "./core/ProviderClass";
import { WPPConnect } from "./providers";

const provider = new WPPConnect();
const bot = new Bot(provider);
const mainFlow = createFlow("main")
  .addKeyword("hola")
  .addAction(async ({ sendResponse, sendImage, goToFlow }) => {
    sendImage("https://linktr.ee/og/image/sofidev.jpg");
    goToFlow("second");
  });

const secondFlow = createFlow("second")
  .addKeyword("test")
  .addAction(async ({ sendResponse, sendImage, goToFlow }) => {
    sendResponse("SofiDev");
  });

bot.addFlow([mainFlow, secondFlow]);
