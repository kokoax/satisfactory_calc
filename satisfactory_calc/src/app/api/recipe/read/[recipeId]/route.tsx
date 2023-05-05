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

  const recipe = await prisma.recipe.findUnique({where: {
      id: Number(recipeId)
    },
  });

  return NextResponse.json(
    {
      body: recipe
    }, {
      status: 200
    }
  );
}
