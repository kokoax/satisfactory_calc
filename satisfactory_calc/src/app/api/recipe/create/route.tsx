import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client';

export async function POST(request: Request) {
  const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });
  const { recipeName, inName, inAmount, outName, outAmount } = await request.json();

  const createData = async (recipeId: number, itemName: string[][], itemAmount: string[][], in_out: string): Promise<Prisma.CostCreateInput[]> => {
    const result: Prisma.CostCreateInput[] = [];
    for(var i = 0; i < itemName.length; i++) {
      const name = itemName[i][1];
      const item = await prisma.item.findUnique({where: {name: name}});

      result.push({
        recipe: {
          connect: {
            id: recipeId
          }
        },
        item: {
          connect: {
            id: item === null ? 0 : item.id
          }
        },
        amount: Number(itemAmount[i][1]),
        in_out: in_out,
      } as Prisma.CostCreateInput);
    }
    return new Promise((resolve) => resolve(result));
  };

  const recipe = await prisma.recipe.create({data: {
      name: recipeName,
    },
  });

  const data: Prisma.CostCreateInput[] = ([] as Prisma.CostCreateInput[]).concat(
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
