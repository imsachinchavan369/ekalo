"use client";

export async function uploadToR2(file: File, folder: string, userId: string) {
  const signed = await fetch("/api/r2/sign-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, fileType: file.type, folder, userId })
  }).then((response) => response.json());

  if (!signed.uploadUrl) {
    throw new Error(signed.error ?? "Could not prepare upload.");
  }

  const upload = await fetch(signed.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file
  });

  if (!upload.ok) {
    throw new Error("Media upload failed.");
  }

  return signed.publicUrl as string;
}
