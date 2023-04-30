import { NextResponse } from "next/server";

export async function GET(req: Request) {
  return NextResponse.json(
    [
      {
        productId: 100,
        name: "product1"
      }, {
        productId: 200,
        name: "product2"
      }, {
        productId: 300,
        name: "product3"
      }
    ], {
      status: 200
    }
  );
}
