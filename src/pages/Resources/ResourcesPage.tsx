import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, FileText, BookOpen } from "lucide-react";
import clsx from "clsx";

import ResourceCard from "./components/ResourceCard";
import ResourceForm from "./components/ResourceForm";
import PreviewModal from "./components/PreviewModal";
import ResourceFilters from "./components/ResourceFilters";

import { MOCK_ARTICLES, MOCK_COURSES } from "./mockData";
import type { Resource, ResourceFormData } from "./types";

type ActiveTab = "articles" | "courses";
type StatusFilter = "all" | "published" | "draft";

const ResourcesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") as ActiveTab | null;
  const activeTab: ActiveTab = tabParam === "courses" ? "courses" : "articles";

  const [articles, setArticles] = useState<Resource[]>(MOCK_ARTICLES);
  const [courses, setCourses] = useState<Resource[]>(MOCK_COURSES);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Resource | null>(null);
  const [previewItem, setPreviewItem] = useState<Resource | null>(null);

  // Reset filters when tab changes
  useEffect(() => {
    setSearch("");
    setStatusFilter("all");
  }, [activeTab]);

  const isArticles = activeTab === "articles";
  const data = isArticles ? articles : courses;
  const setData = isArticles ? setArticles : setCourses;

  const filtered = data.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.author.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: data.length,
    published: data.filter((i) => i.status === "published").length,
    draft: data.filter((i) => i.status === "draft").length,
  };

  const handleSave = (form: ResourceFormData) => {
    if (editItem) {
      setData((prev) =>
        prev.map((i) => (i.id === editItem.id ? { ...editItem, ...form } : i)),
      );
    } else {
      const newItem: Resource = {
        ...form,
        id: Date.now(),
        date: new Date().toLocaleDateString("en-GB"),
        likes: 0,
      };
      setData((prev) => [newItem, ...prev]);
    }
    setShowForm(false);
    setEditItem(null);
  };

  const handleEdit = (item: Resource) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this item?")) {
      setData((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const handleOpenCreate = () => {
    setEditItem(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Resources</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage articles and courses published on the platform
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={16} />
          New {isArticles ? "Article" : "Course"}
        </button>
      </div>

      {/* Tabs — driven by ?tab= query param */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(
          [
            {
              key: "articles",
              label: "Articles",
              icon: FileText,
              count: articles.length,
            },
            {
              key: "courses",
              label: "Courses",
              icon: BookOpen,
              count: courses.length,
            },
          ] as const
        ).map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => setSearchParams({ tab: key })}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === key
                ? "bg-white text-blue-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            <Icon size={14} />
            {label}
            <span
              className={clsx(
                "text-xs px-1.5 py-0.5 rounded-full",
                activeTab === key
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-200 text-gray-500",
              )}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <ResourceFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        counts={counts}
        activeTab={activeTab}
      />

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          {isArticles ? (
            <FileText size={40} className="mb-3 opacity-30" />
          ) : (
            <BookOpen size={40} className="mb-3 opacity-30" />
          )}
          <p className="text-sm font-medium">No {activeTab} found</p>
          <p className="text-xs mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <ResourceCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPreview={setPreviewItem}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <ResourceForm
          initial={editItem}
          resourceType={activeTab}
          onSave={handleSave}
          onCancel={handleCloseForm}
        />
      )}

      {previewItem && (
        <PreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
      )}
    </div>
  );
};

export default ResourcesPage;
