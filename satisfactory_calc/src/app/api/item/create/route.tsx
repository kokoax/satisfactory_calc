import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

type paramsType = {
  itemName: string;
};

type Props = {
  params: paramsType
};

export async function POST(request: Request) {
  const prisma = new PrismaClient({ log: [{emit: "stdout", level: "query"}, "info", "warn", "error"] });
  const { itemName } = await request.json();
  const data = { name: itemName };

  console.log('start item create');
  console.log(data);
  prisma.item.create({ data });
  console.log('end item create');

  return NextResponse.json(
    {
      body: "item created"
    }, {
      status: 200
    }
  );
}
