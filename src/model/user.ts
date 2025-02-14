import { PrismaClient, User } from "@prisma/client";
import { IncreaseAssets } from "./handler";


async function CreateUser(prisma: PrismaClient, userName: string, id: string): Promise<User> {
	try {
		const existingUser = await prisma.user.findUnique({
			where: {
				serverId: id,
			},
		});

		if (existingUser) {
			throw new Error("すでにアカウントが存在します。");
		}

		const user = await prisma.user.create({
			data: {
				name: userName,
				serverId: id,
			},
		});
		return user;
	} catch (error) {
		throw error;
	}
}

async function Daily(prisma: PrismaClient, id: string): Promise<User> {
	try {
		const isReceived = await prisma.getAmountLog.findFirst({
			where: {
				userId: id,
				description: "daily",
				createdAt: {
					gte: new Date(new Date().setHours(0, 0, 0, 0)),
				}
			},
		});
		if (!isReceived) {
			return await IncreaseAssets(prisma, id, Math.floor(Math.random() * 150) + 150, "daily");
		} else {
			throw new Error("すでにログインボーナスを受け取っています。");
		}
	} catch (error) {
		throw error;
	}
}

export { CreateUser, Daily };
