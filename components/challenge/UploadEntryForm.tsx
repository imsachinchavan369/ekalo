"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { createEntry } from "@/lib/firestore";
import { getCurrentUser } from "@/lib/auth";
import { MAX_IMAGE_UPLOAD_SIZE, R2_UPLOAD_FOLDERS } from "@/lib/constants";

async function uploadToR2(file: File, folder: string, userId: string) {
  const signed = await fetch("/api/r2/sign-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, fileType: file.type, folder, userId })
  }).then((response) => response.json());

  if (!signed.uploadUrl) {
    throw new Error(signed.error ?? "Could not prepare upload.");
  }

  await fetch(signed.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file
  });

  return signed.publicUrl as string;
}

export function UploadEntryForm({ challengeId }: { challengeId: string }) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setMessage("");

    try {
      const user = getCurrentUser();
      if (!user) {
        throw new Error("Log in with Google to participate.");
      }

      const beforeImage = formData.get("beforeImage");
      const afterImage = formData.get("afterImage");
      const title = String(formData.get("title") ?? "");

      if (!(beforeImage instanceof File) || beforeImage.size === 0 || !(afterImage instanceof File) || afterImage.size === 0) {
        throw new Error("Before image and after image are required.");
      }

      for (const file of [beforeImage, afterImage]) {
        if (!file.type.startsWith("image/")) {
          throw new Error("Only image files are supported for this challenge.");
        }
        if (file.size > MAX_IMAGE_UPLOAD_SIZE) {
          throw new Error("Max file size is 10MB.");
        }
      }

      const beforeImageUrl = await uploadToR2(beforeImage, R2_UPLOAD_FOLDERS.beforeImages, user.uid);
      const afterImageUrl = await uploadToR2(afterImage, R2_UPLOAD_FOLDERS.afterImages, user.uid);

      await createEntry({
        challengeId,
        userId: user.uid,
        username: user.displayName ?? user.email ?? "EKALO creator",
        userPhoto: user.photoURL,
        title,
        beforeImageUrl,
        afterImageUrl
      });

      setMessage("Entry submitted. You are in the challenge.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not submit entry.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit} className="grid gap-4 rounded-lg border border-ekalo-line bg-black/40 p-5">
      <input name="title" placeholder="Entry title optional" className="rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-ekalo-gold" />
      <input name="beforeImage" type="file" accept="image/*" required className="text-sm text-white/70 file:mr-4 file:rounded-md file:border-0 file:bg-ekalo-gold file:px-4 file:py-2 file:font-semibold file:text-black" />
      <input name="afterImage" type="file" accept="image/*" required className="text-sm text-white/70 file:mr-4 file:rounded-md file:border-0 file:bg-ekalo-gold file:px-4 file:py-2 file:font-semibold file:text-black" />
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Uploading..." : "Submit Entry"}</Button>
      {message ? <p className="text-sm text-white/70">{message}</p> : null}
    </form>
  );
}
