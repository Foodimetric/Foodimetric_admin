import { useState, useMemo, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { FOODIMETRIC_HOST_URL } from "../../utils";

const categoryOptions = [
  "Others", // category = 0
  "Lecturer/Researcher", // category = 1
  "Dietitian/Clinical Nutritionist", // category = 2
  "Nutrition Student", // category = 3
];

export const CustomPrompts = () => {
  const [prompts, setPrompts] = useState<
    { id: string; content: string; category: string }[]
  >([]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [newPrompt, setNewPrompt] = useState("");
  const [modalCategory, setModalCategory] = useState(categoryOptions[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

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

      {/* Prompt Cards */}
      {loading ? (
        <p className="text-center text-sm text-gray-500">Loading prompts...</p>
      ) : error ? (
        <p className="text-center text-sm text-red-500">{error}</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrompts.length > 0 ? (
            filteredPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="bg-gray-50 border p-4 rounded-xl shadow-sm space-y-1"
              >
                <p className="text-sm text-gray-700">{prompt.content}</p>
                <p className="text-xs text-gray-500">
                  Category: {prompt.category}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-sm text-gray-500 py-10">
              No record found for this category.
            </div>
          )}
        </div>
      )}

      {/* Modal */}
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
