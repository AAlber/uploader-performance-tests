import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import { R2 } from "~/server/s3";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  const url = await getSignedUrl(
    R2,
    new PutObjectCommand({ Bucket: "performance-test", Key: key! }),
    { expiresIn: 3600 }
  );
  return NextResponse.json({ url });
};
