import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CommandType } from "../types/commands";

type APIAuthcode = { token: string };

export const LinkCommand: CommandType[] = [
	{
		name: "link",
		builder: new SlashCommandBuilder()
			.setName('link')
			.setDescription('ちきなコインと連携します')
			.addStringOption(option =>
				option.setName('username')
					.setDescription('ちきなコインのユーザーネームを入力してください')
					.setRequired(true))
			.addStringOption(option =>
				option.setName('code')
					.setDescription('発行済みの認証コードを入力してください')
					.setRequired(true)),
		handler: async function (prisma, interaction, api, basicInfo) {
			const username = interaction.options.getString('username');
			const code = interaction.options.getString('code');

			if (!username || !code) {
				return await interaction.reply({ content: '入力が不正です', ephemeral: true });
			}

			const response = await fetch(`${api}/authcode`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username: username, code: Number(code) })
      });
			const data = await response.json() as APIAuthcode;

			if (!response.ok || !data) {
				const embed = new EmbedBuilder()
          .setTitle('連携失敗')
          .setDescription(`エラー: 通信に失敗しました`)
          .setFooter({ text: `BOT ver${basicInfo.version}` })
          .setColor('#ff0000');
        return await interaction.reply({ embeds: [embed] });
			}

			console.log(data.token);

			await prisma.account.create({
				data: {
					discord_id: interaction.user.id,
					username: username,
					token: data.token
				}
			})

			const embed = new EmbedBuilder()
          .setTitle('連携成功')
          .setDescription('アカウントの連携に成功しました')
          .setFooter({ text: `BOT ver${basicInfo.version}` })
          .setColor('#00ff00');

      return await interaction.reply({ embeds: [embed] });
		}
	}
]
