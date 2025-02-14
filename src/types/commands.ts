import { ChatInputCommandInteraction, InteractionResponse, SlashCommandOptionsOnlyBuilder } from "discord.js";
import { PrismaClient } from '@prisma/client';

type basicInfo = {
  version: string;
}

type CommandHandlerType = (prisma: PrismaClient, interaction: ChatInputCommandInteraction, api: string, basicInfo: basicInfo) => Promise<InteractionResponse>;

type CommandType = {
  name: string;
  builder: SlashCommandOptionsOnlyBuilder;
  handler: CommandHandlerType;
}

export { CommandType, CommandHandlerType };
