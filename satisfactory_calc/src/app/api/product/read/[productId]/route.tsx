import { NextResponse } from "next/server";

type paramsType = {
  productId: number;
};

type Props = {
  params: paramsType
};

export async function GET(request: Request, { params }: Props) {
  const { productId } = params
  return NextResponse.json(
    {
      productId: productId,
      name: "product"
    }, {
      status: 200
    }
  );
}
