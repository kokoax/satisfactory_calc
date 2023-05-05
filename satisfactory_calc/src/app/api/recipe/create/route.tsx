import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client';

export async function POST(request: Request) {
  const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });
  const { recipeName, inName, inAmount, outName, outAmount } = await request.json();

  const createData = async (recipeId: number, itemName: Map<string, string>, itemAmount: Map<string, number>, in_out: string): Prisma.CostCreateInput[] => {
    const result: Prisma.CostCreateInput[] = [];
    for(var i = 0; i < itemName.length; i++) {
      const name = itemName[i][1];

      result.push({
        recipe_id: recipeId,
        item_id: (await prisma.item.findUnique({where: {name: name}})).id,
        amount: itemAmount[i][1],
        in_out: in_out
      } as Prisma.CostCreateInput);
    }
    return result;
  };

  const recipe = await prisma.recipe.create({data: {
      name: recipeName,
    },
  });

  console.log(recipe);
  const data: Prisma.CostCreateInput[] = [].concat(
    await createData(recipe.id, inName.value, inAmount.value, "in"),
    await createData(recipe.id, outName.value, outAmount.value, "out")
  );

  data.map(async (d) => {
    await prisma.cost.create({ data: d });
  });

  return NextResponse.json(
    {
      body: "recipe and cost created"
    }, {
      status: 200
    }
  );
}
