import { useState, useMemo, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X, Trash2, AlertTriangle } from "lucide-react";
import { FOODIMETRIC_HOST_URL } from "../../utils";
import {
  useActivityLog,
  ACTION_TYPES,
} from "../Activity-log/context/ActivityLogContext";

const categoryOptions = [
  "Others", // category = 0
  "Lecturer/Researcher", // category = 1
  "Dietitian/Clinical Nutritionist", // category = 2
  "Nutrition Student", // category = 3
];

export const CustomPrompts = () => {
  const { logActivity } = useActivityLog();

  const [prompts, setPrompts] = useState<
    { id: string; content: string; category: string }[]
  >([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<{
    id: string;
    content: string;
    category: string;
  } | null>(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [newPrompt, setNewPrompt] = useState("");
  const [modalCategory, setModalCategory] = useState(categoryOptions[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      setError(null);

      const user_token = localStorage.getItem("authToken");
      if (!user_token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await fetch(`${FOODIMETRIC_HOST_URL}/prompt/prompts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.error || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      // Transform server response into flat list
      const transformed = result.data.flatMap((item: any) =>
        item.prompts.map((p: string, index: number) => ({
          id: `${item._id}-${index}`,
          content: p,
          category: categoryOptions[item.category] || "Others",
        }))
      );

      setPrompts(transformed);
    } catch (error) {
      console.error("Error fetching prompts:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch prompts"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (prompt: {
    id: string;
    content: string;
    category: string;
  }) => {
    setPromptToDelete(prompt);
    setDeleteConfirmOpen(true);
    setDeleteReason("");
  };

  const handleDeleteConfirm = async () => {
    if (!promptToDelete || deleteReason.trim().length < 3) {
      setError("Please provide a reason with at least 3 characters");
      return;
    }

    try {
      setDeleting(promptToDelete.id);
      setError(null);
      setDeleteConfirmOpen(false);

      const user_token = localStorage.getItem("authToken");
      if (!user_token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const categoryNumber = categoryOptions.indexOf(promptToDelete.category);

      const response = await fetch(
        `${FOODIMETRIC_HOST_URL}/prompt/delete-prompt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user_token}`,
          },
          body: JSON.stringify({
            category: categoryNumber,
            prompt: promptToDelete.content,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.error || `Failed to delete prompt: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Prompt deleted successfully:", data);

      // Log the delete action with all details in meta
      await logActivity(ACTION_TYPES.DELETE_PROMPT, {
        reason: deleteReason.trim(),
        content: promptToDelete.content,
        category: promptToDelete.category,
      });

      // Refresh prompts after successful deletion
      await fetchPrompts();
    } catch (error) {
      console.error("Error deleting prompt:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete prompt"
      );
    } finally {
      setDeleting(null);
      setPromptToDelete(null);
      setDeleteReason("");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setPromptToDelete(null);
    setDeleteReason("");
  };

  const handleCreatePrompt = async () => {
    if (!newPrompt.trim()) {
      setError("Please enter a prompt message");
      return;
    }

    try {
      setCreating(true);
      setError(null);

      const user_token = localStorage.getItem("authToken");
      if (!user_token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const categoryNumber = categoryOptions.indexOf(modalCategory);

      const response = await fetch(`${FOODIMETRIC_HOST_URL}/prompt/prompts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user_token}`,
        },
        body: JSON.stringify({
          prompts: [newPrompt.trim()],
          category: categoryNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.error || `Failed to create prompt: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Prompt created successfully:", data);

      // Log the create action (non-destructive)
      await logActivity(ACTION_TYPES.CREATE_PROMPT, {
        prompt: newPrompt.trim().substring(0, 100), // Truncate for logging
        category: modalCategory,
      });

      setNewPrompt("");
      setModalCategory(categoryOptions[0]);
      setModalOpen(false);

      await fetchPrompts();
    } catch (error) {
      console.error("Error creating prompt:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create prompt"
      );
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const filteredPrompts = useMemo(() => {
    if (selectedCategory === "All") return prompts;
    return prompts.filter((p) => p.category === selectedCategory);
  }, [prompts, selectedCategory]);

  const relatedPrompts = useMemo(() => {
    if (!newPrompt.trim()) return [];
    return prompts.filter((p) =>
      p.content.toLowerCase().includes(newPrompt.toLowerCase())
    );
  }, [newPrompt, prompts]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Custom Prompts</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700"
          onClick={() => setModalOpen(true)}
        >
          Create Custom Prompt
        </button>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-sm">
          Filter by Category
        </label>
        <select
          className="border p-2 rounded-md w-full md:w-64"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All</option>
          {categoryOptions.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Prompt Cards */}
      {loading ? (
        <p className="text-center text-sm text-gray-500">Loading prompts...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrompts.length > 0 ? (
            filteredPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="bg-gray-50 border p-4 rounded-xl shadow-sm space-y-1 relative group hover:shadow-md transition-shadow"
              >
                <p className="text-sm text-gray-700">{prompt.content}</p>
                <p className="text-xs text-gray-500">
                  Category: {prompt.category}
                </p>

                {/* Delete Button - Shows on Hover */}
                <button
                  onClick={() => handleDeleteClick(prompt)}
                  disabled={deleting === prompt.id}
                  className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out transform translate-y-2 group-hover:translate-y-0 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  title="Delete prompt"
                >
                  {deleting === prompt.id ? (
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 size={12} />
                  )}
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-sm text-gray-500 py-10">
              No record found for this category.
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => {}} // Prevent closing by clicking outside
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-orange-500" size={24} />
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  Delete Custom Prompt
                </Dialog.Title>
              </div>
              <button
                onClick={handleDeleteCancel}
                className="text-gray-400 hover:text-gray-600"
                disabled={deleting !== null}
              >
                <X size={20} />
              </button>
            </div>

            {promptToDelete && (
              <div className="mb-6 p-3 bg-gray-50 rounded-md border">
                <p className="text-xs text-gray-500 mb-1">Prompt to delete:</p>
                <p className="text-sm text-gray-800 font-medium">
                  {promptToDelete.content}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Category: {promptToDelete.category}
                </p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please provide a reason for deleting this prompt:
              </label>
              <textarea
                rows={3}
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Enter reason for deletion..."
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={deleting !== null}
                autoFocus
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting !== null}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting !== null || deleteReason.trim().length < 3}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {deleting ? "Deleting..." : "Delete Prompt"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Create Prompt Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <Dialog.Title className="text-lg font-semibold mb-4">
              New Custom Prompt
            </Dialog.Title>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <label className="text-sm font-medium">Prompt Message</label>
            <textarea
              rows={3}
              className="w-full border mt-1 p-2 rounded-md text-sm relative"
              value={newPrompt}
              placeholder="Enter custom prompt..."
              onChange={(e) => setNewPrompt(e.target.value)}
              disabled={creating}
            />

            {relatedPrompts.length > 0 && (
              <div className="mt-2 border rounded-md bg-yellow-100 p-2 text-sm max-h-32 overflow-auto">
                <p className="font-medium mb-1">Related Prompts:</p>
                <ul className="list-disc ml-5 space-y-1">
                  {relatedPrompts.map((p) => (
                    <li key={p.id}>{p.content}</li>
                  ))}
                </ul>
              </div>
            )}

            <label className="text-sm font-medium mt-4 block">
              Select Category
            </label>
            <select
              className="w-full border p-2 rounded-md mb-4 text-sm"
              value={modalCategory}
              onChange={(e) => setModalCategory(e.target.value)}
              disabled={creating}
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <button
              onClick={handleCreatePrompt}
              disabled={creating || !newPrompt.trim()}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? "Saving..." : "Save Prompt"}
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};
