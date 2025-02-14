import { Client, Events, GatewayIntentBits } from "discord.js";
import EconomyBot from "./src/commands";
import { PrismaClient } from "@prisma/client";

const client: Client = new Client({ intents: [GatewayIntentBits.Guilds] });

const prisma = new PrismaClient();

client.once(Events.ClientReady, (c) => {
  console.log(`起動しました ログインタグは ${c.user.tag}`);
  if (process.env.DISCORD_BOT_NAME != client.user?.username) {
    console.error("設定されたBOT名とログインしたBOT名が一致しません。");
    process.exit(1);
  }
  main();
});

client.login(process.env.DISCORD_BOT_TOKEN).catch((error) => {
  console.error("ログインに失敗しました:", error);
  process.exit(1);
});

function main() {
  try {
    client.user?.setActivity("経済を操作中", { type: 4 });
		EconomyBot(prisma , client);
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
}
