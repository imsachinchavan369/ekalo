"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Pencil, Star, Trash2, Trophy, Upload } from "lucide-react";
import { defaultCategories, listenToCategories } from "@/lib/categories";
import { listenToCompetitions, saveCompetition, updateCompetitionStatus } from "@/lib/competitions";
import { uploadToR2 } from "@/lib/mediaUpload";
import type { Category } from "@/types/category";
import type { Competition, CompetitionInput, CompetitionMediaType, CompetitionStatus } from "@/types/competition";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FieldLabel, inputClass } from "@/components/admin/challenges/fields";
import { useAdmin } from "@/components/providers/AppProviders";

const mediaTypes: CompetitionMediaType[] = ["video", "photo", "audio", "image", "mixed"];

function toLocalInput(value: unknown) {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : typeof value === "object" && "toDate" in value && typeof value.toDate === "function" ? value.toDate() : null;
  if (!date || Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function blankCompetition(userId = "", category?: Category): CompetitionInput {
  return {
    title: "",
    categoryId: category?.id ?? "rap",
    categorySlug: category?.slug ?? "rap",
    categoryName: category?.name ?? "Rap",
    type: "challenge",
    description: "",
    rules: [],
    prizePool: "",
    entryFee: "free",
    entryFeeType: "free",
    entryFeeAmount: 0,
    maxEntries: null,
    allowedMediaTypes: ["video"],
    thumbnailUrl: "",
    coverImageUrl: "",
    rulesVideoUrl: "",
    rulesVideoType: null,
    startsAt: "",
    endsAt: "",
    resultAt: "",
    status: "draft",
    isFeatured: false,
    isVisible: false,
    createdBy: userId
  };
}

export function AdminCompetitionManagement() {
  const { user } = useAdmin();
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [editing, setEditing] = useState<CompetitionInput>(() => blankCompetition(user?.uid));
  const [rulesText, setRulesText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => listenToCategories(setCategories, true), []);
  useEffect(() => listenToCompetitions(setCompetitions, true), []);

  const selectedCategory = useMemo(() => categories.find((category) => category.id === editing.categoryId || category.slug === editing.categorySlug) ?? categories[0], [categories, editing.categoryId, editing.categorySlug]);

  function set<K extends keyof CompetitionInput>(key: K, value: CompetitionInput[K]) {
    setEditing((current) => ({ ...current, [key]: value }));
  }

  function selectCategory(categoryId: string) {
    const category = categories.find((item) => item.id === categoryId);
    if (!category) return;
    setEditing((current) => ({ ...current, categoryId: category.id, categorySlug: category.slug, categoryName: category.name }));
  }

  function toggleMedia(type: CompetitionMediaType) {
    setEditing((current) => {
      const next = current.allowedMediaTypes.includes(type) ? current.allowedMediaTypes.filter((item) => item !== type) : [...current.allowedMediaTypes, type];
      return { ...current, allowedMediaTypes: next.length ? next : [type] };
    });
  }

  function validateBeforeSave(status: CompetitionStatus) {
    if (!editing.title.trim()) return "Title is required.";
    if (!editing.categoryId || !editing.categorySlug) return "Category is required.";
    if (status !== "draft") {
      if (!editing.startsAt || !editing.endsAt) return "Start and end date/time are required before publishing.";
      if (!editing.resultAt) return "Result date/time is required before publishing.";
      const startsAt = new Date(String(editing.startsAt)).getTime();
      const endsAt = new Date(String(editing.endsAt)).getTime();
      const resultAt = new Date(String(editing.resultAt)).getTime();
      if (!Number.isFinite(startsAt) || !Number.isFinite(endsAt) || !Number.isFinite(resultAt)) return "Start, end, and result date/time must be valid.";
      if (endsAt <= startsAt) return "End date/time must be after start date/time.";
      if (resultAt <= endsAt) return "Result date/time must be after end date/time.";
      if ((status === "scheduled" || status === "live") && !(editing.thumbnailUrl || editing.coverImageUrl)) return "Competition thumbnail is required before publishing.";
    }
    if (editing.entryFeeType === "paid" && Number(editing.entryFeeAmount) <= 0) return "Paid competition requires an entry fee amount greater than 0.";
    return "";
  }

  async function uploadAdminMedia(file: File, kind: "thumbnail" | "rules-video") {
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const allowedVideoTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (kind === "thumbnail" && !allowedImageTypes.includes(file.type)) throw new Error("Thumbnail must be jpg, jpeg, png, or webp.");
    if (kind === "rules-video" && !allowedVideoTypes.includes(file.type)) throw new Error("Rules video must be mp4, webm, or mov.");
    if (kind === "rules-video" && file.size > 50 * 1024 * 1024) throw new Error("Rules video must be 50MB or smaller.");
    setIsUploading(true);
    try {
      const url = await uploadToR2(file, `admin/competitions/${editing.id || "new"}`, user?.uid || "admin");
      if (kind === "thumbnail") {
        setEditing((current) => ({ ...current, thumbnailUrl: url, coverImageUrl: current.coverImageUrl || url }));
      } else {
        setEditing((current) => ({ ...current, rulesVideoUrl: url, rulesVideoType: "upload" }));
      }
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSave(status?: CompetitionStatus) {
    const nextStatus = status ?? editing.status;
    if (selectedCategory?.status === "upcoming" && status === "live") {
      alert("Upcoming categories can be saved as draft or scheduled. Mark the category active before publishing live.");
      return;
    }
    const validationMessage = validateBeforeSave(nextStatus);
    if (validationMessage) {
      alert(validationMessage);
      return;
    }
    setIsSaving(true);
    try {
      const entryFeeType = editing.entryFeeType;
      await saveCompetition({
        ...editing,
        status: nextStatus,
        isVisible: status && status !== "draft" ? true : editing.isVisible,
        entryFee: entryFeeType,
        entryFeeType,
        entryFeeAmount: entryFeeType === "paid" ? Number(editing.entryFeeAmount) : 0,
        thumbnailUrl: editing.thumbnailUrl || editing.coverImageUrl,
        coverImageUrl: editing.coverImageUrl || editing.thumbnailUrl,
        rules: rulesText.split("\n").map((rule) => rule.trim()).filter(Boolean),
        createdBy: editing.createdBy || user?.uid || ""
      });
      setEditing(blankCompetition(user?.uid, categories[0]));
      setRulesText("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Competition could not be saved.");
    } finally {
      setIsSaving(false);
    }
  }

  function editCompetition(competition: Competition) {
    setEditing({
      ...competition,
      entryFee: competition.entryFeeType,
      entryFeeType: competition.entryFeeType,
      entryFeeAmount: competition.entryFeeType === "paid" ? competition.entryFeeAmount : 0,
      thumbnailUrl: competition.thumbnailUrl || competition.coverImageUrl,
      coverImageUrl: competition.coverImageUrl || competition.thumbnailUrl,
      rulesVideoUrl: competition.rulesVideoUrl || "",
      rulesVideoType: competition.rulesVideoType ?? null
    });
    setRulesText(competition.rules.join("\n"));
  }

  const thumbnailPreview = editing.thumbnailUrl || editing.coverImageUrl;

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-ekalo-line bg-black/40 p-5 shadow-card">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-ekalo-gold" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-white">{editing.id ? "Edit Competition" : "Create Competition"}</h2>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <FieldLabel label="Title">
            <input value={editing.title} onChange={(event) => set("title", event.target.value)} className={inputClass} />
          </FieldLabel>
          <FieldLabel label="Category">
            <select value={editing.categoryId} onChange={(event) => selectCategory(event.target.value)} className={inputClass}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name} {category.status === "hidden" ? "(hidden)" : category.status === "upcoming" ? "(upcoming)" : ""}</option>
              ))}
            </select>
          </FieldLabel>
          <FieldLabel label="Competition type">
            <input value={editing.type} onChange={(event) => set("type", event.target.value)} className={inputClass} />
          </FieldLabel>
          <FieldLabel label="Prize / reward">
            <input value={editing.prizePool} onChange={(event) => set("prizePool", event.target.value)} className={inputClass} />
          </FieldLabel>
          <FieldLabel label="Entry Fee Type">
            <select value={editing.entryFeeType} onChange={(event) => {
              const value = event.target.value as CompetitionInput["entryFeeType"];
              setEditing((current) => ({ ...current, entryFee: value, entryFeeType: value, entryFeeAmount: value === "free" ? 0 : current.entryFeeAmount }));
            }} className={inputClass}>
              <option value="free">free</option>
              <option value="paid">paid</option>
            </select>
          </FieldLabel>
          {editing.entryFeeType === "paid" ? (
            <FieldLabel label="Entry Fee Amount">
              <input type="number" min="1" required placeholder="Enter amount in ₹" value={editing.entryFeeAmount || ""} onChange={(event) => set("entryFeeAmount", Number(event.target.value))} className={inputClass} />
            </FieldLabel>
          ) : null}
          <FieldLabel label="Max entries optional">
            <input type="number" min="0" value={editing.maxEntries ?? ""} onChange={(event) => set("maxEntries", event.target.value ? Number(event.target.value) : null)} className={inputClass} />
          </FieldLabel>
          <FieldLabel label="Status">
            <select value={editing.status} onChange={(event) => set("status", event.target.value as CompetitionStatus)} className={inputClass}>
              <option value="draft">draft</option>
              <option value="scheduled">scheduled</option>
              <option value="live">live</option>
              <option value="result_pending">result_pending</option>
              <option value="ended">ended</option>
            </select>
          </FieldLabel>
          <FieldLabel label="Start date/time">
            <input type="datetime-local" value={toLocalInput(editing.startsAt)} onChange={(event) => set("startsAt", event.target.value)} className={inputClass} />
          </FieldLabel>
          <FieldLabel label="End date/time">
            <input type="datetime-local" value={toLocalInput(editing.endsAt)} onChange={(event) => set("endsAt", event.target.value)} className={inputClass} />
          </FieldLabel>
          <FieldLabel label="Result Date / Time">
            <input type="datetime-local" value={toLocalInput(editing.resultAt)} onChange={(event) => set("resultAt", event.target.value)} className={inputClass} />
          </FieldLabel>
          <FieldLabel label="Description">
            <textarea value={editing.description} onChange={(event) => set("description", event.target.value)} rows={4} className={inputClass} />
          </FieldLabel>
          <FieldLabel label="Rules">
            <textarea value={rulesText} onChange={(event) => setRulesText(event.target.value)} rows={4} className={inputClass} placeholder="One rule per line" />
          </FieldLabel>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-black/25 p-4">
            <p className="font-semibold text-white">Competition Thumbnail</p>
            <p className="mt-1 text-xs text-white/50">JPG, JPEG, PNG, or WEBP. Recommended 16:9 ratio.</p>
            <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" disabled={isUploading} onChange={(event) => event.target.files?.[0] && uploadAdminMedia(event.target.files[0], "thumbnail").catch((error) => alert(error.message))} className="mt-3 block w-full text-sm text-white/70 file:mr-4 file:rounded-md file:border-0 file:bg-ekalo-gold file:px-4 file:py-2 file:font-semibold file:text-black" />
            <input value={editing.thumbnailUrl} onChange={(event) => setEditing((current) => ({ ...current, thumbnailUrl: event.target.value, coverImageUrl: current.coverImageUrl || event.target.value }))} placeholder="Or paste thumbnail URL" className={`${inputClass} mt-3`} />
            {thumbnailPreview ? (
              <div className="mt-3 overflow-hidden rounded-lg border border-white/10">
                <div className="relative aspect-video bg-slate-950">
                  <Image src={thumbnailPreview} alt="" fill sizes="420px" className="object-cover" />
                </div>
                <button type="button" onClick={() => setEditing((current) => ({ ...current, thumbnailUrl: "", coverImageUrl: "" }))} className="flex w-full items-center justify-center gap-2 bg-white/5 px-3 py-2 text-sm font-semibold text-white/70 hover:text-white">
                  <Trash2 className="h-4 w-4" /> Remove thumbnail
                </button>
              </div>
            ) : null}
          </div>
          <div className="rounded-lg border border-white/10 bg-black/25 p-4">
            <p className="font-semibold text-white">Rules / Instruction Video (Optional)</p>
            <p className="mt-1 text-xs text-white/50">MP4, WEBM, or MOV. Recommended max 60 seconds and 50MB.</p>
            <input type="file" accept="video/mp4,video/webm,video/quicktime" disabled={isUploading} onChange={(event) => event.target.files?.[0] && uploadAdminMedia(event.target.files[0], "rules-video").catch((error) => alert(error.message))} className="mt-3 block w-full text-sm text-white/70 file:mr-4 file:rounded-md file:border-0 file:bg-ekalo-gold file:px-4 file:py-2 file:font-semibold file:text-black" />
            <input value={editing.rulesVideoUrl} onChange={(event) => setEditing((current) => ({ ...current, rulesVideoUrl: event.target.value, rulesVideoType: event.target.value ? "url" : null }))} placeholder="Or paste video URL" className={`${inputClass} mt-3`} />
            {editing.rulesVideoUrl ? (
              <div className="mt-3 overflow-hidden rounded-lg border border-white/10">
                <video src={editing.rulesVideoUrl} controls className="aspect-video w-full bg-black object-contain" />
                <button type="button" onClick={() => setEditing((current) => ({ ...current, rulesVideoUrl: "", rulesVideoType: null }))} className="flex w-full items-center justify-center gap-2 bg-white/5 px-3 py-2 text-sm font-semibold text-white/70 hover:text-white">
                  <Trash2 className="h-4 w-4" /> Remove video
                </button>
              </div>
            ) : null}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {mediaTypes.map((type) => (
            <button key={type} type="button" onClick={() => toggleMedia(type)} className={editing.allowedMediaTypes.includes(type) ? "rounded-lg bg-ekalo-gold px-3 py-2 text-sm font-bold text-black" : "rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-white/70"}>
              {type}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/25 p-3 text-white"><input type="checkbox" checked={editing.isFeatured} onChange={(event) => set("isFeatured", event.target.checked)} /> Featured</label>
          <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/25 p-3 text-white"><input type="checkbox" checked={editing.isVisible} onChange={(event) => set("isVisible", event.target.checked)} /> Visible</label>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="button" disabled={isSaving || isUploading} variant="outline" onClick={() => handleSave("draft")}>Save Draft</Button>
          <Button type="button" disabled={isSaving || isUploading} variant="purpleGhost" onClick={() => handleSave("scheduled")}>Schedule</Button>
          <Button type="button" disabled={isSaving || isUploading} onClick={() => handleSave("live")}>{isSaving ? "Saving..." : "Publish Live"}</Button>
        </div>
      </section>

      <section className="rounded-lg border border-ekalo-line bg-black/40 p-5 shadow-card">
        <h2 className="text-xl font-semibold text-white">Competition Management</h2>
        <div className="mt-4 grid gap-3">
          {competitions.map((competition) => (
            <div key={competition.id} className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-4 lg:grid-cols-[84px_1fr_auto] lg:items-center">
              <div className="relative aspect-video overflow-hidden rounded-md bg-slate-950">
                {competition.thumbnailUrl || competition.coverImageUrl ? <Image src={competition.thumbnailUrl || competition.coverImageUrl} alt="" fill sizes="84px" className="object-cover" /> : null}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-white">{competition.title}</span>
                  <Badge>{competition.status}</Badge>
                  <Badge>{competition.categoryName}</Badge>
                  <Badge>{competition.entryFeeType}</Badge>
                  {competition.entryFeeType === "paid" ? <Badge>₹{competition.entryFeeAmount}</Badge> : null}
                  {competition.isFeatured ? <Badge>featured</Badge> : null}
                  {!competition.isVisible ? <Badge>hidden</Badge> : null}
                </div>
                <p className="mt-2 text-sm text-white/55">{competition.description || "No description."}</p>
                <p className="mt-1 text-xs text-white/40">Start: {toLocalInput(competition.startsAt) || "TBA"} · End: {toLocalInput(competition.endsAt) || "TBA"} · Result: {toLocalInput(competition.resultAt) || "TBA"}</p>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <Button type="button" size="sm" variant="outline" icon={<Pencil className="h-4 w-4" />} onClick={() => editCompetition(competition)}>Edit</Button>
                <Button type="button" size="sm" variant="outline" icon={competition.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} onClick={() => saveCompetition({ ...competition, isVisible: !competition.isVisible })}>{competition.isVisible ? "Hide" : "Unhide"}</Button>
                <Button type="button" size="sm" variant="outline" icon={<Star className="h-4 w-4" />} onClick={() => saveCompetition({ ...competition, isFeatured: !competition.isFeatured })}>{competition.isFeatured ? "Unfeature" : "Feature"}</Button>
                <Button type="button" size="sm" variant="purpleGhost" onClick={() => updateCompetitionStatus(competition.id, competition.status === "ended" ? "live" : "ended")}>{competition.status === "ended" ? "Publish" : "End"}</Button>
              </div>
            </div>
          ))}
          {!competitions.length ? <p className="text-white/60">No competitions created yet.</p> : null}
        </div>
      </section>
    </div>
  );
}
