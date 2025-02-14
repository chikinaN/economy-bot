import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CommandType } from "../types/commands";

type APIBalance = { balance: number };

export const ProfileCommand: CommandType[] = [
	{
		name: "profile",
		builder: new SlashCommandBuilder()
			.setName('profile')
			.setDescription('残高を確認します'),
		handler: async function (prisma, interaction, api, basicInfo) {
			const account = await prisma.account.findFirst({
				where: { discord_id: interaction.user.id },
				select: { token: true }
			});

			if (!account) {
				return await interaction.reply({ content: '連携がされていません', ephemeral: true });
			}

			const response = await fetch(`${api}/get_balance`, {
				method: 'GET',
				headers: {
					'Authorization': account.token
				}
			});
			const data = await response.json() as APIBalance;

			if (!response.ok || !data) {
				const embed = new EmbedBuilder()
          .setTitle('連携失敗')
          .setDescription(`エラー: 残高取得中にエラーが発生しました`)
          .setFooter({ text: `BOT ver${basicInfo.version}` })
          .setColor('#ff0000');
        await interaction.reply({ embeds: [embed] });
			}

			const member = await interaction.guild?.members.fetch(interaction.user.id);
			const displayName = member?.displayName?? interaction.user.username;

			const embed = new EmbedBuilder()
				.setTitle('残高')
				.setDescription(`${displayName}の残高は、${data.balance.toLocaleString()}ゴリラコインです。`)
				.setColor('#009990');
			return await interaction.reply({ embeds: [embed] });
		}
	}
]
