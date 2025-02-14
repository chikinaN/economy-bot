import { PrismaClient, User } from "@prisma/client";
import { CalcAsset } from "../lib/get";

async function IncreaseAssets(
  prisma: PrismaClient,
  serverId: string,
  amount: number,
  description: string
): Promise<User> {
  try {
    const user = await GetUser(prisma, serverId).then((user) => {
      if (user) {
        return user;
      } else {
        throw new Error("ユーザーが見つかりませんでした。");
      }
    });
    const assets = await CalcAsset(user, amount);
    await prisma.getAmountLog.create({
      data: {
        amount: assets,
        userId: user.serverId,
        description: description,
      },
    });
    return await prisma.user.update({
      where: {
        serverId: serverId,
      },
      data: {
        assets: {
          increment: assets,
        },
      },
    });
  } catch (error) {
    throw error;
  }
}

async function DecreaseAssets( prisma: PrismaClient, serverId: string, amount: number, description: string ): Promise<User> {
  try {
    const user = await GetUser(prisma, serverId).then((user) => {
      if (user) {
        return user;
      } else {
        throw new Error("ユーザーが見つかりませんでした。");
      }
    });
    const assets = await CalcAsset(user, amount);
    if (!(user.assets < assets)) {
			await prisma.getAmountLog.create({
        data: {
          amount: assets,
          userId: user.serverId,
          description: description,
        },
      });
      return await prisma.user.update({
        where: {
          serverId: serverId,
        },
        data: {
          assets: {
            decrement: assets,
          },
        },
      });
    } else {
			throw new Error("残高が不足しています。");
		}
  } catch (error) {
    throw error;
  }
}

async function GetUser(prisma: PrismaClient, id: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        serverId: id,
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
}

export { IncreaseAssets, GetUser, DecreaseAssets };
