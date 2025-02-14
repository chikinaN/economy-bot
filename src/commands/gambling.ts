import { SlashCommandBuilder } from "discord.js";
import { CommandType } from "../types/commands";
import * as send from "../lib/send";
import * as get from "../lib/get";
import { Dice } from "../model/gambling";

export const GamblingCommand: CommandType[] = [
	{
		name: "dice",
		builder: new SlashCommandBuilder()
			.setName("dice")
			.setDescription("サイコロを振ります。")
			.addStringOption(option => option
        .setName('amount')
        .setDescription('賭けるお金を決める')
        .setRequired(true)
      ),
		handler: async function (prisma, interaction) {
			const amountStr = interaction.options.getString('amount');
			const amount = Number(amountStr);
			if (!amount) return await send.SendReply(interaction, send.GenerateText(`賭けるお金を入力してください。`));
			const result = await Dice(prisma, interaction.user.id, amount);
			const displayName = await get.GetDisplayName(interaction, interaction.user.id);
			await send.SendReply(interaction, send.GenerateText(`${displayName}はサイコロで${amount}コインを賭けました。`));
			await send.SendReply(interaction, send.GenerateText(`サイコロを振りました。結果は${result}でした。`));
		}
	}
]
