import { NextResponse } from "next/server";
import { createR2SignedUploadUrl } from "@/lib/r2";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      fileName?: string;
      fileType?: string;
      folder?: string;
      userId?: string;
    };

    if (!body.fileName || !body.fileType || !body.folder) {
      return NextResponse.json({ error: "fileName, fileType, and folder are required." }, { status: 400 });
    }

    // Production should verify the Firebase ID token here and derive userId from it.
    // R2 CORS must allow PUT from the deployed web origin with the requested content-type.
    const signedUpload = await createR2SignedUploadUrl({
      fileName: body.fileName,
      fileType: body.fileType,
      folder: body.folder,
      userId: body.userId ?? "anonymous"
    });

    return NextResponse.json(signedUpload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not sign upload.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
