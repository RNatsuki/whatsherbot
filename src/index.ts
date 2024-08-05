import { createFlow, Bot, EVENTS } from "./bot";
import { WPPConnect } from "./providers";

const provider = new WPPConnect();
const bot = new Bot(provider);

const mainFlow = createFlow("main")
  .addKeyword(EVENTS.WELCOME)
  .addAction(({ sendResponse, sendImage, data }) => {
    console.log({ data });
    sendResponse("Hola, soy un bot");
  });

bot.addFlow([mainFlow]);
