import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import { createCanvas, loadImage } from 'canvas';
import { CommandType } from "../types/commands";

// 全角換算20文字くらいで改行するための関数
function splitCommentByWidth(str: string, maxFullWidthChars: number): string[] {
  const lines: string[] = [];
  let currentLine = '';
  let currentWidth = 0;

  // <br>タグがあれば改行
  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (char === '<' && str.slice(i, i + 4) === '<br>') {
      lines.push(currentLine);
      currentLine = '';
      currentWidth = 0;
      i += 3; 
      continue;
    }

    // 全角文字を1、半角文字を0.55と計算し、maxFullWidthChars(20文字)を超えたら改行
    const w = /[\u0000-\u00FF]/.test(char) ? 0.55 : 1;
    if (currentWidth + w > maxFullWidthChars) {
      lines.push(currentLine);
      currentLine = '';
      currentWidth = 0;
    }
    currentLine += char;
    currentWidth += w;
  }

  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

export const SuperchatCommand: CommandType[] = [
  {
    name: "superchat",
    builder: new SlashCommandBuilder()
      .setName('superchat')
      .setDescription('スパチャを送れます')
      .addIntegerOption(option =>
        option.setName('amount')
          .setDescription('スパチャの金額を入力してください 青色(100~199) 緑色(~499) 黄色(~999) オレンジ色(~1999) 赤色(~4999) ピンク色(~9999) 赤色(10000~)')
          .setRequired(true))
      .addStringOption(option =>
        option.setName('comment')
          .setDescription('スパチャのコメントを入力してください'))
      .addUserOption(option =>
        option.setName('user')
          .setDescription('スーパチャットを送るユーザーを選択してください')),
    handler: async function (_, interaction) {
      const avatarURL = interaction.user.displayAvatarURL({ extension: 'png' });
      const avatarImage = await loadImage(avatarURL);
      const amount = interaction.options.getInteger('amount') || 0;
      const username = interaction.options.getUser('user');
      let comment = interaction.options.getString('comment') || '';

      comment = comment.replace(/#/g, '\\#');
      comment = comment.replace(/\r/g, '');
      comment = comment.replace(/\n/g, '');
      comment = comment.replace(/\r\n/g, '');
      comment = comment.replace(/\u202E/g, '');

      let sendBackGroundColor = '', upperColor = '', footerColor = '', moneyColor = '', nameColor = '';

      // 全角換算20文字くらいで改行
      const comments = splitCommentByWidth(comment, 20);

      if (amount >= 10000) {
        sendBackGroundColor = '#990000';
        upperColor = '#d00000ff';
        footerColor = '#e62117ff';
        moneyColor = '#ffffffff';
        nameColor = '#ffffffb3';
      } else if (amount >= 5000) {
        sendBackGroundColor = '#991e63';
        upperColor = '#c2185bff';
        footerColor = '#e91e63ff';
        moneyColor = '#ffffffff';
        nameColor = '#ffffffb3';
      } else if (amount >= 2000) {
        sendBackGroundColor = '#b23e00'; 
        upperColor = '#e65100ff';
        footerColor = '#f57c00ff';
        moneyColor = '#ffffffdf';
        nameColor = '#ffffffb3';
      } else if (amount >= 1000) {
        sendBackGroundColor = '#b68600';
        upperColor = '#ffb300ff';
        footerColor = '#ffca28ff';
        moneyColor = '#000000df';
        nameColor = '#0000008a';
      } else if (amount >= 500) {
        sendBackGroundColor = '#009990';
        upperColor = '#00bfa5ff';
        footerColor = '#1de9b6ff';
        moneyColor = '#000000ff';
        nameColor = '#0000008a';
      } else if (amount >= 200) {
        sendBackGroundColor = '#007e91';
        upperColor = '#00b8d4ff';
        footerColor = '#00e5ffff';
        moneyColor = '#000000ff';
        nameColor = '#000000b3';
      } else if (amount >= 100) {
        sendBackGroundColor = '#0f4d94';
        upperColor = '#1565c0ff';
        footerColor = '#1e88e5ff';
        moneyColor = '#ffffffff';
        nameColor = '#ffffffb3';
      } else {
        return interaction.reply({ content: '100円以上で入力してください', ephemeral: true });
      }

      if (comments.length === 0) {
        // キャンバスの作成
        const canvas = createCanvas(400, 60);
        const context = canvas.getContext('2d');
  
        // 上の色
        context.fillStyle = upperColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
  
        // アイコン
        context.save();
        context.beginPath();
        context.arc(40, canvas.height - 30, 20, 0, Math.PI * 2);
        context.closePath();
        context.clip();
        context.drawImage(avatarImage, 20, canvas.height - 50, 40, 40);
        context.restore();
  
        // ユーザーネーム
        context.font = "18px";
        context.fillStyle = nameColor;
        context.fillText((await interaction.guild?.members.fetch(interaction.user.id))?.displayName || interaction.user.username, 80, canvas.height - 35);
  
        // 金額
        context.font = "18px";
        context.fillStyle = moneyColor;
        context.fillText(`¥${amount.toLocaleString()}`, 80, canvas.height - 15);
  
        // キャンバスの生成
        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'superchat.png' });
        return await interaction.reply({ files: [attachment] });
      } else {
        // キャンバスの作成
        const canvas = createCanvas(400, 90 + comments.length * 20);
        const context = canvas.getContext('2d');
  
        // 上の色
        context.fillStyle = upperColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
  
        // 下の色
        context.fillStyle = footerColor;
        context.fillRect(0, canvas.height - 30 - comments.length * 20, canvas.width, 30 + comments.length * 20);
  
        // アイコン
        context.save();
        context.beginPath();
        context.arc(40, canvas.height - 60 - comments.length * 20, 20, 0, Math.PI * 2);
        context.closePath();
        context.clip();
        context.drawImage(avatarImage, 20, canvas.height - 80 - comments.length * 20, 40, 40);
        context.restore();
  
        // ユーザーネーム
        context.font = "18px";
        context.fillStyle = nameColor;
        context.fillText((await interaction.guild?.members.fetch(interaction.user.id))?.displayName || interaction.user.username, 80, canvas.height - 60 - comments.length * 20);
  
        // 金額
        context.font = "18px";
        context.fillStyle = moneyColor;
        context.fillText(`¥${amount.toLocaleString()}`, 80, canvas.height - 40 - comments.length * 20);
  
        // コメント
        context.font = "18px";
        context.fillStyle = moneyColor;
        for (let i = 0; i < comments.length; i++) {
          context.fillText(comments[i], 20, canvas.height - comments.length * 20 + 20 * i);
        }
  
        // キャンバスの生成
        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'superchat.png' });
        return await interaction.reply({ files: [attachment] });
      }
    }
  }
];