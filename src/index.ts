import { createFlow, Bot } from "./bot";
import { WPPConnect } from "./providers";

const bot = new Bot(new WPPConnect());
const mainFlow = createFlow("main").addKeyword("hola").addAction(async ({ sendResponse, sendImage }) => {});

bot.addFlow([mainFlow]);
