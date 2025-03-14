import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CommandType } from "../types/commands";

type APIAuthcode = { checked_in: boolean, token: string };

export const CheckinCommand: CommandType[] = [
  {
    name: "checkin",
    builder: new SlashCommandBuilder()
      .setName('checkin')
      .setDescription('トークンを更新できます'),
    handler: async function (prisma, interaction, api, basicInfo) {
      const account = await prisma.account.findFirst({
        where: { discord_id: interaction.user.id },
        select: { token: true }
      });

      if (!account) {
        return await interaction.reply({ content: '連携がされていません', ephemeral: true });
      }

      const response = await fetch(`${api}/checkin`, {
        method: 'POST',
        headers: {
          'Authorization': account.token
        }
      });
      const data = await response.json() as APIAuthcode;

      if (!response.ok || !data) {
        const embed = new EmbedBuilder()
          .setTitle('トークン更新失敗')
          .setDescription(`エラー: トークン更新中にエラーが発生しました`)
          .setFooter({ text: `BOT ver${basicInfo.version}` })
          .setColor('#ff0000');
        return await interaction.reply({ embeds: [embed] });
      }

      if (data.checked_in === true) {
                await prisma.account.updateMany({
          where: { discord_id: interaction.user.id },
          data: { token: data.token }
        });

        console.log(`変更後のトークン: ${data.token}`)

        const embed = new EmbedBuilder()
          .setTitle('チェックイン')
          .setDescription('ログインボーナスを付与しました。')
          .setFooter({ text: `BOT ver${basicInfo.version}` })
          .setColor('#00ff00');
        return await interaction.reply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder()
          .setTitle('チェックイン済み')
          .setDescription(`ログインボーナスは付与済みです。`)
          .setFooter({ text: `BOT ver${basicInfo.version}` })
          .setColor('#ff0000');
        return await interaction.reply({ embeds: [embed], ephemeral: true });
      }
  }
  }
];
