import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

export async function GET(request: Request) {
  const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });
  const costList: object | null = await prisma.cost.findMany({ include: { item: true, recipe: true } });
  return NextResponse.json(
    {
      body: costList
    }, {
      status: 200
    }
  );
}
