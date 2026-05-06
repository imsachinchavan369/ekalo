"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { defaultCategories, deleteCategory, listenToCategories, saveCategory, updateCategoryStatus } from "@/lib/categories";
import { slugify } from "@/lib/challenges";
import type { Category, CategoryInput, CategoryStatus } from "@/types/category";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FieldLabel, inputClass } from "@/components/admin/challenges/fields";

function blankCategory(order: number): CategoryInput {
  return { name: "", slug: "", description: "", status: "upcoming", isVisible: true, order, icon: "sparkles" };
}

export function AdminCategoryManagement() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [editing, setEditing] = useState<CategoryInput>(() => blankCategory(20));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => listenToCategories(setCategories, true), []);

  const nextOrder = useMemo(() => Math.max(0, ...categories.map((category) => category.order)) + 1, [categories]);

  async function handleSave() {
    setIsSaving(true);
    try {
      await saveCategory({ ...editing, slug: slugify(editing.slug || editing.name), order: Number(editing.order || nextOrder) });
      setEditing(blankCategory(nextOrder + 1));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Category could not be saved.");
    } finally {
      setIsSaving(false);
    }
  }

  function set<K extends keyof CategoryInput>(key: K, value: CategoryInput[K]) {
    setEditing((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-ekalo-line bg-black/40 p-5 shadow-card">
        <div className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-ekalo-gold" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-white">{editing.id ? "Edit Category" : "Add Category"}</h2>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <FieldLabel label="Name">
            <input value={editing.name} onChange={(event) => setEditing((current) => ({ ...current, name: event.target.value, slug: slugify(event.target.value) }))} className={inputClass} />
          </FieldLabel>
          <FieldLabel label="Slug">
            <input value={editing.slug} onChange={(event) => set("slug", slugify(event.target.value))} className={inputClass} />
          </FieldLabel>
          <FieldLabel label="Status">
            <select value={editing.status} onChange={(event) => set("status", event.target.value as CategoryStatus)} className={inputClass}>
              <option value="active">active</option>
              <option value="upcoming">upcoming</option>
              <option value="hidden">hidden</option>
            </select>
          </FieldLabel>
          <FieldLabel label="Order">
            <input type="number" value={editing.order} onChange={(event) => set("order", Number(event.target.value))} className={inputClass} />
          </FieldLabel>
          <FieldLabel label="Icon">
            <input value={editing.icon} onChange={(event) => set("icon", event.target.value)} className={inputClass} />
          </FieldLabel>
          <FieldLabel label="Visible">
            <select value={editing.isVisible ? "yes" : "no"} onChange={(event) => set("isVisible", event.target.value === "yes")} className={inputClass}>
              <option value="yes">yes</option>
              <option value="no">no</option>
            </select>
          </FieldLabel>
          <FieldLabel label="Description">
            <textarea value={editing.description} onChange={(event) => set("description", event.target.value)} rows={3} className={inputClass} />
          </FieldLabel>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="button" disabled={isSaving || !editing.name} onClick={handleSave}>{isSaving ? "Saving..." : "Save Category"}</Button>
          {editing.id ? <Button type="button" variant="outline" onClick={() => setEditing(blankCategory(nextOrder))}>Cancel Edit</Button> : null}
        </div>
      </section>

      <section className="rounded-lg border border-ekalo-line bg-black/40 p-5 shadow-card">
        <h2 className="text-xl font-semibold text-white">Category Management</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left text-sm">
            <thead className="text-white/55">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Slug</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Visible</th>
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="bg-white/[0.035] text-white">
                  <td className="rounded-l-lg px-3 py-3 font-semibold">{category.name}{category.isProtected ? <span className="ml-2 text-xs text-ekalo-gold">Protected</span> : null}</td>
                  <td className="px-3 py-3 text-white/65">{category.slug}</td>
                  <td className="px-3 py-3"><Badge>{category.status}</Badge></td>
                  <td className="px-3 py-3">{category.isVisible ? "Visible" : "Hidden"}</td>
                  <td className="px-3 py-3">{category.order}</td>
                  <td className="rounded-r-lg px-3 py-3">
                    <div className="flex justify-end gap-2">
                      <Button type="button" size="sm" variant="outline" icon={<Pencil className="h-4 w-4" />} onClick={() => setEditing(category)}>Edit</Button>
                      <Button type="button" size="sm" variant="outline" icon={category.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} onClick={() => updateCategoryStatus(category.id, category.isVisible ? "hidden" : "upcoming", !category.isVisible)}>{category.isVisible ? "Hide" : "Unhide"}</Button>
                      <Button type="button" size="sm" variant="purpleGhost" onClick={() => updateCategoryStatus(category.id, category.status === "active" ? "upcoming" : "active", true)}>{category.status === "active" ? "Upcoming" : "Active"}</Button>
                      <Button type="button" size="sm" variant="outline" icon={<Trash2 className="h-4 w-4" />} onClick={() => deleteCategory(category).catch((error) => alert(error.message))}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
