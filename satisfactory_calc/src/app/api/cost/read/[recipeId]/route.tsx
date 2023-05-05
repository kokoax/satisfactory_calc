import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

type paramsType = {
  itemId: number;
};

type Props = {
  params: paramsType
};

export async function GET(request: Request, { params }: Props) {
  const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });
  const { recipeId } = params

  const cost = await prisma.cost.findMany({where: {
      recipe_id: Number(recipeId)
    },
    include: {
      recipe: true,
      item: true
    }
  });

  return NextResponse.json(
    {
      body: JSON.stringify(cost)
    }, {
      status: 200
    }
  );
}
