import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

type paramsType = {
  itemId: number;
};

type Props = {
  params: paramsType
};

export async function POST(request: Request, { params }: Props) {
  const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });
  const { itemId } = params

  await prisma.item.delete({where: {
      id: parseInt(itemId)
    },
  });

  return NextResponse.json(
    {
      body: "item deleted"
    }, {
      status: 200
    }
  );
}
