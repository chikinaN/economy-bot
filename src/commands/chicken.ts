import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CommandType } from "../types/commands";

type APIBalance = { balance: number };

export const ChickenCommand: CommandType[] = [
	{
		name: "chicken",
		builder: new SlashCommandBuilder()
			.setName('chicken')
			.setDescription('ちきん'),
		handler: async function (prisma, interaction, api, basicInfo) {
			const embed = new EmbedBuilder()
				.setTitle('ちきん')
				.setDescription(`🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗🐓🍗`)
				.setColor('#009990');
			return await interaction.reply({ embeds: [embed] });
		}
	}
]
