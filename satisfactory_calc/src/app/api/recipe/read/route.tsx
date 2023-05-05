import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

export async function GET(request: Request) {
  const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });
  const recipeList: object | null = await prisma.recipe.findMany();
  return NextResponse.json(
    {
      body: recipeList
    }, {
      status: 200
    }
  );
}
