import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";


export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type: string }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      const message = "Invalid signature";
      return new Response(JSON.stringify({ message, isValidSignature, body }), {
        status: 401,
      });
    }

    if (!body?._type) {
      revalidateTag("page");
    } else {
      revalidateTag(body?._type);
    }

    return NextResponse.json({ body });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify(err), { status: 500 });
  }
}