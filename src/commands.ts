import { Client, REST, Routes, Events } from "discord.js";
import { CommandType, CommandHandlerType } from "./types/commands";
import { PrismaClient } from '@prisma/client';
import { LinkCommand } from "./commands/link";
import { ProfileCommand } from "./commands/profile";
import { SuperchatCommand } from "./commands/superchat";
import { RankingCommand } from "./commands/ranking"; 
import { ChickenCommand } from "./commands/chicken";
import { CheckinCommand } from "./commands/checkin";

const commands: CommandType[] = [ ...LinkCommand, ...ProfileCommand, ...SuperchatCommand, ...RankingCommand, ...ChickenCommand, ...CheckinCommand ]; 

// 以下気にしなくていいところ

function economyHandlers(commands: CommandType[]): { [key: string]: CommandHandlerType } {
  return commands.reduce((handlers, command) => {
    handlers[command.name] = command.handler;
    return handlers;
  }, {} as { [key: string]: CommandHandlerType });
}

async function registerCommands(client: Client, rest: REST) {
  try {
    await rest.put(
      Routes.applicationCommands(client.user?.id ?? ""),
      { body: commands.map(command => command.builder.toJSON()) }
    );
  } catch (err) {
    console.error('Failed to register commands:', err);
  }
}

function EconomyCommand(prisma: PrismaClient, client: Client) {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN ?? "");
  const commandHandlers = economyHandlers(commands);
  const apiUrl = process.env.API_URL;
  const basicInfo = { version: process.env.npm_package_version ?? "0.0.1" };
  if (!apiUrl) {
    console.error('API_URL is not defined.');
    return;
  }

  if (process.env.DISCORD_BOT_TOKEN) {
    registerCommands(client, rest).then(() => {
      client.on(Events.InteractionCreate, async (interaction) => {
        if (interaction.isChatInputCommand()) {
          return commandHandlers[interaction.commandName](prisma, interaction, apiUrl, basicInfo);
        }
      });
    });
  }
}

export default EconomyCommand;
