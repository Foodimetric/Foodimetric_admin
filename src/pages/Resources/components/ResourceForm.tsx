import { useState } from "react";
import { X, Save, Tag, User, Image, Heart } from "lucide-react";
import clsx from "clsx";
import ContentEditor from "./ContentEditor";
import type { Resource, ResourceFormData } from "../types";

interface ResourceFormProps {
  initial?: Resource | null;
  resourceType: "articles" | "courses";
  onSave: (form: ResourceFormData) => void;
  onCancel: () => void;
}

const EMPTY_FORM: ResourceFormData = {
  title: "",
  author: "",
  category: "ARTICLES",
  description: "",
  image: "",
  slug: "",
  content: "",
  status: "draft",
};

const autoSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const ResourceForm = ({
  initial,
  resourceType,
  onSave,
  onCancel,
}: ResourceFormProps) => {
  const [form, setForm] = useState<ResourceFormData>(
    initial
      ? {
          title: initial.title,
          author: initial.author,
          category: initial.category,
          description: initial.description,
          image: initial.image,
          slug: initial.slug,
          content: initial.content,
          status: initial.status,
        }
      : {
          ...EMPTY_FORM,
          category: resourceType === "courses" ? "COURSES" : "ARTICLES",
        },
  );

  const set = <K extends keyof ResourceFormData>(
    key: K,
    val: ResourceFormData[K],
  ) => setForm((f) => ({ ...f, [key]: val }));

  const handleTitleChange = (val: string) => {
    set("title", val);
    if (!form.slug || form.slug === autoSlug(form.title)) {
      set("slug", autoSlug(val));
    }
  };

  return (
    <div className="fixed inset-0 -top-10 z-50 bg-black/40 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {initial ? "Edit" : "Create"}{" "}
              {resourceType === "courses" ? "Course" : "Article"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Fill in the details below
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>
        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Title *
            </label>
            <input
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter a descriptive title..."
            />
          </div>

          {/* Slug + Author */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                <span className="flex items-center gap-1">
                  <Tag size={11} /> Slug
                </span>
              </label>
              <input
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                placeholder="auto-generated-from-title"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                <span className="flex items-center gap-1">
                  <User size={11} /> Author *
                </span>
              </label>
              <input
                value={form.author}
                onChange={(e) => set("author", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Author name"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              <span className="flex items-center gap-1">
                <Image size={11} /> Cover Image URL
              </span>
            </label>
            <input
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Short Description *
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="A brief summary shown on listing cards..."
            />
          </div>

          {/* Content Editor */}
          <ContentEditor
            value={form.content}
            onChange={(v) => set("content", v)}
          />

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Status
            </label>
            <div className="flex items-center gap-3">
              {(["draft", "published"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => set("status", s)}
                  className={clsx(
                    "px-4 py-2 rounded-xl text-sm border transition-colors capitalize",
                    form.status === s
                      ? s === "published"
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-amber-500 text-white border-amber-500"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-400">
            <Heart size={14} />
            Likes will start at{" "}
            <span className="font-medium text-gray-600">0</span> and update
            after publishing.
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onCancel}
            className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-5 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save size={14} />
            {initial ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceForm;
