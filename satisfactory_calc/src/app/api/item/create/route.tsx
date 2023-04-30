import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

export async function POST(request: Request) {
  const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });
  const { itemName } = await request.json();

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
