"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getCurrentUser, signInWithGoogle } from "@/lib/auth";
import { createChallengeEntry, getUserEntryCount } from "@/lib/entries";
import { uploadToR2 } from "@/lib/mediaUpload";
import type { Challenge } from "@/types/challenge";

type EntryUploadFormProps = {
  challenge: Challenge;
};

function mbToBytes(size: number) {
  return size * 1024 * 1024;
}

function validateFile(file: File, allowedTypes: string[], maxSizeMB: number, label: string) {
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`${label} must be one of: ${allowedTypes.join(", ")}.`);
  }
  if (file.size > mbToBytes(maxSizeMB)) {
    throw new Error(`${label} must be ${maxSizeMB}MB or smaller.`);
  }
}

async function getVideoDuration(file: File) {
  return new Promise<number | null>((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(Number.isFinite(video.duration) ? video.duration : null);
    };
    video.onerror = () => resolve(null);
    video.src = URL.createObjectURL(file);
  });
}

export function EntryUploadForm({ challenge }: EntryUploadFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isPaid = challenge.entryMode === "paid";

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setMessage("");

    try {
      let user = getCurrentUser();
      if (!user) {
        await signInWithGoogle();
        user = getCurrentUser();
      }
      if (!user) throw new Error("Log in with Google to participate.");
      if (challenge.status !== "live") throw new Error("This challenge is not live.");
      if (isPaid) throw new Error("Payment integration coming soon. Paid entries are not unlocked yet.");

      const count = await getUserEntryCount(challenge.id, user.uid);
      const maxEntries = challenge.allowMultipleEntries ? challenge.maxEntriesPerUser : challenge.freeEntriesPerUser;
      if (count >= maxEntries) throw new Error("You have reached the entry limit for this challenge.");

      const title = String(formData.get("title") ?? "");
      const caption = String(formData.get("caption") ?? "");
      const beforeImage = formData.get("beforeImage");
      const afterImage = formData.get("afterImage");
      const videoFile = formData.get("video");
      const thumbnailFile = formData.get("thumbnail");
      const media = { beforeImageUrl: "", afterImageUrl: "", videoUrl: "", thumbnailUrl: "" };
      const fileTypes: string[] = [];
      const fileSizes: number[] = [];
      let videoDurationSeconds: number | null = null;
      let durationUnknown = false;

      if (challenge.challengeType === "image") {
        if (challenge.uploadRules.requireBeforeImage && (!(beforeImage instanceof File) || beforeImage.size === 0)) throw new Error("Before image is required.");
        if (challenge.uploadRules.requireAfterImage && (!(afterImage instanceof File) || afterImage.size === 0)) throw new Error("After image is required.");
        for (const [file, label, key] of [
          [beforeImage, "Before image", "beforeImageUrl"],
          [afterImage, "After image", "afterImageUrl"]
        ] as const) {
          if (file instanceof File && file.size > 0) {
            validateFile(file, challenge.uploadRules.allowedUploadTypes, challenge.uploadRules.maxImageSizeMB, label);
            media[key] = await uploadToR2(file, `entries/${challenge.id}/${user.uid}`, key === "beforeImageUrl" ? "before" : "after");
            fileTypes.push(file.type);
            fileSizes.push(file.size);
          }
        }
      } else {
        if (challenge.uploadRules.requireVideo && (!(videoFile instanceof File) || videoFile.size === 0)) throw new Error("Video is required.");
        if (videoFile instanceof File && videoFile.size > 0) {
          validateFile(videoFile, challenge.uploadRules.allowedUploadTypes, challenge.uploadRules.maxVideoSizeMB, "Video");
          videoDurationSeconds = await getVideoDuration(videoFile);
          durationUnknown = videoDurationSeconds === null;
          if (videoDurationSeconds && videoDurationSeconds > challenge.uploadRules.maxVideoDurationSeconds) {
            throw new Error(`Video must be ${challenge.uploadRules.maxVideoDurationSeconds} seconds or shorter.`);
          }
          media.videoUrl = await uploadToR2(videoFile, `entries/${challenge.id}/${user.uid}`, "video");
          fileTypes.push(videoFile.type);
          fileSizes.push(videoFile.size);
        }
        if (thumbnailFile instanceof File && thumbnailFile.size > 0) {
          validateFile(thumbnailFile, ["image/jpeg", "image/png", "image/webp"], challenge.uploadRules.maxImageSizeMB, "Thumbnail");
          media.thumbnailUrl = await uploadToR2(thumbnailFile, `entries/${challenge.id}/${user.uid}`, "thumbnail");
          fileTypes.push(thumbnailFile.type);
          fileSizes.push(thumbnailFile.size);
        }
        if (challenge.participation.requireBeforeAfter) {
          for (const [file, label, key] of [
            [beforeImage, "Before image", "beforeImageUrl"],
            [afterImage, "After image", "afterImageUrl"]
          ] as const) {
            if (!(file instanceof File) || file.size === 0) throw new Error(`${label} is required.`);
            validateFile(file, ["image/jpeg", "image/png", "image/webp"], challenge.uploadRules.maxImageSizeMB, label);
            media[key] = await uploadToR2(file, `entries/${challenge.id}/${user.uid}`, key === "beforeImageUrl" ? "before" : "after");
            fileTypes.push(file.type);
            fileSizes.push(file.size);
          }
        }
      }

      const entryId = await createChallengeEntry({
        challenge,
        userId: user.uid,
        username: user.displayName ?? user.email ?? "EKALO creator",
        userPhoto: user.photoURL,
        title,
        caption,
        media,
        entryMode: "free",
        metadata: { fileTypes, fileSizes, videoDurationSeconds, durationUnknown }
      });

      alert(challenge.adminControls.approveEntriesManually ? "Your entry is submitted for review" : "Your entry is live");
      router.push(`/entry/${entryId}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not submit entry.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isPaid) {
    return (
      <div className="rounded-lg border border-ekalo-line bg-black/40 p-5 shadow-card">
        <h2 className="text-xl font-semibold text-white">Payment required</h2>
        <p className="mt-2 text-white/65">Entry amount: {challenge.paidEntryCurrency} {challenge.paidEntryAmount}</p>
        <Button type="button" disabled className="mt-5">Payment integration coming soon</Button>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="grid gap-4 rounded-lg border border-ekalo-line bg-black/40 p-5 shadow-card">
      <h2 className="text-xl font-semibold text-white">Submit Entry</h2>
      <input name="title" placeholder="Entry title optional" className="rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-ekalo-gold" />
      <textarea name="caption" placeholder={challenge.participation.requireCaption ? "Caption required" : "Caption optional"} required={challenge.participation.requireCaption} rows={3} className="rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-ekalo-gold" />
      {challenge.challengeType === "image" ? (
        <>
          <input name="beforeImage" type="file" accept={challenge.uploadRules.allowedUploadTypes.join(",")} required={challenge.uploadRules.requireBeforeImage} className="text-sm text-white/70 file:mr-4 file:rounded-md file:border-0 file:bg-ekalo-gold file:px-4 file:py-2 file:font-semibold file:text-black" />
          <input name="afterImage" type="file" accept={challenge.uploadRules.allowedUploadTypes.join(",")} required={challenge.uploadRules.requireAfterImage} className="text-sm text-white/70 file:mr-4 file:rounded-md file:border-0 file:bg-ekalo-gold file:px-4 file:py-2 file:font-semibold file:text-black" />
        </>
      ) : (
        <>
          <input name="video" type="file" accept={challenge.uploadRules.allowedUploadTypes.join(",")} required={challenge.uploadRules.requireVideo} className="text-sm text-white/70 file:mr-4 file:rounded-md file:border-0 file:bg-ekalo-gold file:px-4 file:py-2 file:font-semibold file:text-black" />
          <input name="thumbnail" type="file" accept="image/jpeg,image/png,image/webp" className="text-sm text-white/70 file:mr-4 file:rounded-md file:border-0 file:bg-ekalo-gold file:px-4 file:py-2 file:font-semibold file:text-black" />
          {challenge.participation.requireBeforeAfter ? (
            <>
              <input name="beforeImage" type="file" accept="image/jpeg,image/png,image/webp" required className="text-sm text-white/70 file:mr-4 file:rounded-md file:border-0 file:bg-ekalo-gold file:px-4 file:py-2 file:font-semibold file:text-black" />
              <input name="afterImage" type="file" accept="image/jpeg,image/png,image/webp" required className="text-sm text-white/70 file:mr-4 file:rounded-md file:border-0 file:bg-ekalo-gold file:px-4 file:py-2 file:font-semibold file:text-black" />
            </>
          ) : null}
        </>
      )}
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Uploading..." : "Submit Entry"}</Button>
      {message ? <p className="text-sm text-white/70">{message}</p> : null}
    </form>
  );
}
