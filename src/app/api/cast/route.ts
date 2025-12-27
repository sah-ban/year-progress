import { NextRequest, NextResponse } from "next/server";
import {
  Message,
  NobleEd25519Signer,
  CastAddBody,
  makeCastAdd,
} from "@farcaster/core";
import { hexToBytes } from "@noble/hashes/utils";

const fid = 844184;
const SIGNER = process.env.PRIVATE_KEY || "";

export async function POST(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");

  if (!key || key !== process.env.KEY) {
    return NextResponse.json(
      { error: "Invalid or misssing key" },
      { status: 400 }
    );
  }
  const now = new Date();

  // UTC midnight (same day for everyone)
  const utcToday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  const y = utcToday.getUTCFullYear();
  const start = new Date(Date.UTC(y, 0, 1));
  const end = new Date(Date.UTC(y + 1, 0, 1));

  const dayMs = 1000 * 60 * 60 * 24;

  const total = Math.floor((end.getTime() - start.getTime()) / dayMs);
  const passed = Math.min(
    total,
    Math.floor((utcToday.getTime() - start.getTime()) / dayMs)
  );

  const percent = (passed / total) * 100;
  const at = Math.floor(Date.now() / 1000);

  const hubUrl = process.env.HUB_URL || "";
  try {
    const privateKeyBytes = hexToBytes(SIGNER);
    const ed25519Signer = new NobleEd25519Signer(privateKeyBytes);
    const dataOptions = { fid, network: 1 };

    const castBody: CastAddBody = {
      text: `${y} is ${percent.toFixed(2)}% complete!`,
      embeds: [{ url: `${process.env.NEXT_PUBLIC_URL}?t=${at}` }],
      embedsDeprecated: [],
      mentions: [],
      mentionsPositions: [],
      type: 0,
    };

    const castAddReq = await makeCastAdd(castBody, dataOptions, ed25519Signer);
    const castAdd = castAddReq._unsafeUnwrap();
    const messageBytes = Buffer.from(Message.encode(castAdd).finish());

    const response = await fetch(`${hubUrl}/v1/submitMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/octet-stream" },
      body: messageBytes,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json({
      success: true,
      hash: result.hash,
    });
  } catch (error) {
    console.error("Error sending cast:", error);
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
