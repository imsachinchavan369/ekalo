import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { safeFileName } from "@/lib/utils";

function getR2Client() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("Cloudflare R2 is not configured. Add R2_* values to the server environment.");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  });
}

export async function createR2SignedUploadUrl(input: {
  fileName: string;
  fileType: string;
  folder: string;
  userId: string;
}) {
  const bucket = process.env.R2_BUCKET_NAME;
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;

  if (!bucket || !publicBaseUrl) {
    throw new Error("Cloudflare R2 bucket/public URL is not configured.");
  }

  const objectKey = `${input.folder}/${input.userId}/${Date.now()}-${safeFileName(input.fileName)}`;
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: objectKey,
    ContentType: input.fileType
  });

  return {
    uploadUrl: await getSignedUrl(getR2Client(), command, { expiresIn: 60 * 5 }),
    objectKey,
    publicUrl: `${publicBaseUrl.replace(/\/$/, "")}/${objectKey}`
  };
}
