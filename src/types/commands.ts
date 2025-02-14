import { ChatInputCommandInteraction, InteractionResponse, SlashCommandOptionsOnlyBuilder } from "discord.js";
import { PrismaClient } from '@prisma/client';

type CommandHandlerType = (prisma: PrismaClient, interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;

type CommandType = {
  name: string;
  builder: SlashCommandOptionsOnlyBuilder;
  handler: CommandHandlerType;
}

export { CommandType, CommandHandlerType };
