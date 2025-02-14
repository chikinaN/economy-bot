import { SlashCommandBuilder } from "discord.js";
import { CommandType } from "../types/commands";
import { CreateUser, Daily } from "../model/user";
import * as get from "../lib/get";
import * as send from "../lib/send";
import { IncreaseAssets } from "../model/handler";

export const UserCommand: CommandType[] = [
	{
		name: "create",
		builder: new SlashCommandBuilder()
			.setName("create")
			.setDescription("新規アカウントを作成します。"),
		handler: async function (prisma, interaction) {
			const userName = interaction.user.username;
			const serverId = interaction.user.id;
			try {
				const user = await CreateUser(prisma, userName, serverId);
				const displayName = await get.GetDisplayName(interaction, user.serverId);
				await send.SendReply(interaction, send.GenerateText(`新規アカウント: ${displayName}を作成しました。`));
			} catch (error) {
				await send.SendCommandError("create", error, "ユーザー作成エラー", interaction);
			}
		}
	}, {
		name: "daily",
		builder: new SlashCommandBuilder()
			.setName("daily")
			.setDescription("毎日のログインボーナスです。"),
		handler: async function (prisma, interaction) {
			try {
				const serverId = interaction.user.id;
				const user = await Daily(prisma, serverId);
				const displayName = await get.GetDisplayName(interaction, user.serverId);
				await send.SendReply(interaction, send.GenerateText(`${displayName}はログインボーナスを受け取りました。`));
			} catch (error) {
				await send.SendCommandError("daily", error, "クレジット付与エラー", interaction);
			}
		}
	},{
		name: "income",
		builder: new SlashCommandBuilder()
			.setName("income")
			.setDescription("不労所得を得ることができます。"),
		handler: async function (prisma, interaction) {
			try {
				const serverId = interaction.user.id;
				const user = await IncreaseAssets(prisma, serverId, 1000, "income");
				const displayName = await get.GetDisplayName(interaction, user.serverId);
				await send.SendReply(interaction, send.GenerateText(`${displayName}は不労所得を得ました。`));
			} catch (error) {
				await send.SendCommandError("daily", error, "クレジット付与エラー", interaction);
			}
		}
	}
]
