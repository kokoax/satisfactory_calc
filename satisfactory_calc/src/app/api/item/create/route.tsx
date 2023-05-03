import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

export async function POST(request: Request) {
  const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });
  const { itemName } = await request.json();

  const isAlreadyExists: object | null = await prisma.item.findUnique({where: { name: itemName } });
  if(isAlreadyExists) {
    return NextResponse.json(
      {
        body: "Item name is already exists"
      }, {
        status: 500
      }
    );
  }

  await prisma.item.create({data: {
      name: itemName,
    },
  });

  return NextResponse.json(
    {
      body: "item created"
    }, {
      status: 200
    }
  );
}
