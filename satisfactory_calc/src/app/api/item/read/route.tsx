import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

export async function GET(request: Request) {
  const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });
  const itemList: object | null = await prisma.item.findMany();
  return NextResponse.json(
    {
      body: itemList
    }, {
      status: 200
    }
  );
}
