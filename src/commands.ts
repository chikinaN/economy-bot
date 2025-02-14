import { GamblingCommand } from './commands/gambling';
import { Client, REST, Routes, Events } from "discord.js";
import { CommandType, CommandHandlerType } from "./types/commands";
import { UserCommand } from './commands/user';
import { PrismaClient } from '@prisma/client';

const commands: CommandType[] = [ ...GamblingCommand, ...UserCommand ];


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

  if (process.env.DISCORD_BOT_TOKEN) {
    registerCommands(client, rest).then(() => {
      client.on(Events.InteractionCreate, async (interaction) => {
        if (interaction.isChatInputCommand()) {
          return commandHandlers[interaction.commandName](prisma, interaction);
        }
      });
    });
  }
}

export default EconomyCommand;
