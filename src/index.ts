import { createFlow, Bot } from "./bot";
import { WPPConnect } from "./providers";

const provider = new WPPConnect();
const bot = new Bot(provider);
const mainFlow = createFlow("main")
  .addKeyword("hola")
  .addAction(async ({ sendResponse, sendImage, goToFlow }) => {
    sendImage("https://miro.medium.com/v2/resize:fit:900/1*TY9uBBO9leUbRtlXmQBiug.png");
    goToFlow("second");
  });

const secondFlow = createFlow("second").addAction(
  async ({ sendResponse, sendImage, goToFlow }) => {
    sendResponse("Hola desde el segundo flujo");
  }
);

bot.addFlow([mainFlow, secondFlow]);
