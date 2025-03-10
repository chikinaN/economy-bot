import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CommandType } from "../types/commands";

type APIRanking = { ranking: { username: string, balance: number }[] };

export const RankingCommand: CommandType[] = [
  {
    name: "ranking",
    builder: new SlashCommandBuilder()
      .setName('ranking')
      .setDescription('残金のランキングを確認します'),
    handler: async function (prisma, interaction, api, basicInfo) {
      const response = await fetch(`${api}/get_ranking`, {
        method: 'GET',
      });
      const data = await response.json() as APIRanking;

      if (!response.ok || !data) {
        const embed = new EmbedBuilder()
          .setTitle('ランキング取得失敗')
          .setDescription(`エラー: ランキング取得中にエラーが発生しました`)
          .setFooter({ text: `BOT ver${basicInfo.version}` })
          .setColor('#ff0000');
        return await interaction.reply({ embeds: [embed] });
      }

      const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
      const rankingDescription = data.ranking.slice(0, 5).map((entry, index) => {
        const medal = medals[index] || `${index + 1}`;
        return `${medal} ${entry.username}: ${entry.balance.toLocaleString()}ちきなコイン`;
      }).join('\n');

      const embed = new EmbedBuilder()
        .setTitle('残金ランキング')
        .setDescription(rankingDescription)
        .setColor('#009990');
      return await interaction.reply({ embeds: [embed] });
    }
  }
];