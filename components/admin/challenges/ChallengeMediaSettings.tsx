"use client";

import { useState } from "react";
import type { ChallengeInput, CoverMediaType } from "@/types/challenge";
import { uploadToR2 } from "@/lib/mediaUpload";
import { Button } from "@/components/ui/Button";
import { FieldLabel, inputClass } from "@/components/admin/challenges/fields";

type Props = {
  challenge: ChallengeInput;
  onChange: (challenge: ChallengeInput) => void;
  userId: string;
};

export function ChallengeMediaSettings({ challenge, onChange, userId }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const challengeId = challenge.id || challenge.slug || "draft";

  function set<K extends keyof ChallengeInput>(key: K, value: ChallengeInput[K]) {
    onChange({ ...challenge, [key]: value });
  }

  async function uploadFile(file: File, kind: "cover" | "thumbnail") {
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) throw new Error("Only image or video files are supported.");
    if (isVideo && file.size > 100 * 1024 * 1024) throw new Error("Max video size is 100MB.");
    if (isImage && file.size > 10 * 1024 * 1024) throw new Error("Max image size is 10MB.");

    setIsUploading(true);
    try {
      const folder = kind === "thumbnail" ? `challenge-thumbnails/${challengeId}` : `challenge-covers/${challengeId}`;
      const url = await uploadToR2(file, folder, kind);
      if (kind === "thumbnail") {
        set("thumbnailUrl", url);
      } else if (isVideo) {
        onChange({ ...challenge, coverMediaType: "video", coverVideoUrl: url });
      } else {
        onChange({ ...challenge, coverMediaType: "image", coverImageUrl: url });
      }
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <section className="grid gap-4">
      <FieldLabel label="Cover media type">
        <select value={challenge.coverMediaType} onChange={(event) => set("coverMediaType", event.target.value as CoverMediaType)} className={inputClass}>
          <option value="image">image</option>
          <option value="video">video</option>
        </select>
      </FieldLabel>
      <div className="grid gap-4 md:grid-cols-2">
        <FieldLabel label="Cover image URL">
          <input value={challenge.coverImageUrl} onChange={(event) => set("coverImageUrl", event.target.value)} className={inputClass} />
        </FieldLabel>
        <FieldLabel label="Cover video URL">
          <input value={challenge.coverVideoUrl} onChange={(event) => set("coverVideoUrl", event.target.value)} className={inputClass} />
        </FieldLabel>
      </div>
      <FieldLabel label="Thumbnail URL">
        <input value={challenge.thumbnailUrl} onChange={(event) => set("thumbnailUrl", event.target.value)} className={inputClass} />
      </FieldLabel>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="rounded-lg border border-white/10 bg-black/30 p-4 text-sm text-white/70">
          Upload cover image/video
          <input type="file" accept="image/*,video/*" disabled={isUploading} onChange={(event) => event.target.files?.[0] && uploadFile(event.target.files[0], "cover").catch((error) => alert(error.message))} className="mt-3 block w-full file:mr-4 file:rounded-md file:border-0 file:bg-ekalo-gold file:px-4 file:py-2 file:font-semibold file:text-black" />
        </label>
        <label className="rounded-lg border border-white/10 bg-black/30 p-4 text-sm text-white/70">
          Upload thumbnail
          <input type="file" accept="image/*" disabled={isUploading} onChange={(event) => event.target.files?.[0] && uploadFile(event.target.files[0], "thumbnail").catch((error) => alert(error.message))} className="mt-3 block w-full file:mr-4 file:rounded-md file:border-0 file:bg-ekalo-gold file:px-4 file:py-2 file:font-semibold file:text-black" />
        </label>
      </div>
      {isUploading ? <p className="text-sm text-ekalo-gold">Uploading media to R2...</p> : null}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange({ ...challenge })}>Keep Media Settings</Button>
    </section>
  );
}
