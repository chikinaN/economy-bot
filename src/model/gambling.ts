import { PrismaClient } from "@prisma/client";
import { DecreaseAssets, IncreaseAssets } from "./handler";

type DiceResult = {
	win: boolean;
	player: [number, number];
	dealer: [number, number];
	amount: number;
};

async function Dice(prisma: PrismaClient, id: string, amount: number): Promise<DiceResult> {
  try {
    await DecreaseAssets(prisma, id, amount, "dice");

    const rollDice = () => Math.floor(Math.random() * 6) + 1;
    const playerDice: [number, number] = [rollDice(), rollDice()];
    const dealerDice: [number, number] = [rollDice(), rollDice()];

    const multiplier = calcMultiplier(playerDice);
    const win = playerDice[0] + playerDice[1] > dealerDice[0] + dealerDice[1];

		const resultAmount = win ? amount * multiplier : 0;

		if (resultAmount) {
			await IncreaseAssets(prisma, id, resultAmount, "dice");
		}

    return {
      win,
      player: playerDice,
      dealer: dealerDice,
      amount: resultAmount,
    };
  } catch (error) {
    throw error;
  }
}
function calcMultiplier(dice: [number, number]): number {
  if (dice[0] === dice[1]) {
    return dice[0] === 6 ? 3 : 2;
  }
  return 1;
}

export { Dice };
