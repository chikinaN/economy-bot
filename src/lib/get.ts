import { ChatInputCommandInteraction, User } from "discord.js";
import { User as PrismaUser } from "@prisma/client";

function GetDisplayName(interaction: ChatInputCommandInteraction,id: string): Promise<User | null> {
	return interaction.client.users.fetch(id);
}

async function CalcAsset(user: PrismaUser, amount: number): Promise<number> {
	if (user) {
		return amount * user.credit / 100;
	} else {
		throw new Error("ユーザーが見つかりませんでした。");
	}
}

export { GetDisplayName, CalcAsset };
