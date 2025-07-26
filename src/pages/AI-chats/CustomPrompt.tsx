import { useState, useMemo } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

const categoryOptions = [
  "Lecturer/Researcher",
  "Dietitian/Clinical Nutritionist",
  "Nutrition Student",
  "Others",
];

export const CustomPrompts = () => {
  const [prompts, setPrompts] = useState([
    {
      id: 1,
      content: "Suggest a healthy breakfast for a diabetic.",
      category: "Dietitian/Clinical Nutritionist",
    },
    {
      id: 2,
      content: "Create a weekly meal plan for underweight students.",
      category: "Nutrition Student",
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [newPrompt, setNewPrompt] = useState("");
  const [modalCategory, setModalCategory] = useState(categoryOptions[0]);

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

  const handleCreatePrompt = () => {
    if (!newPrompt.trim()) return;
    const newEntry = {
      id: prompts.length + 1,
      content: newPrompt,
      category: modalCategory,
    };
    setPrompts([newEntry, ...prompts]);
    setNewPrompt("");
    setModalOpen(false);
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

      {/* Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        className="relative z-50"
      >
        {/* <div className="fixed inset-0 bg-black/40" aria-hidden="true" /> */}
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

            <label className="text-sm font-medium">Prompt Message</label>
            <textarea
              rows={3}
              className="w-full border mt-1 p-2 rounded-md text-sm relative"
              value={newPrompt}
              placeholder="Enter custom prompt..."
              onChange={(e) => setNewPrompt(e.target.value)}
            />

            {relatedPrompts.length > 0 && (
              <div className="border-2 border-white rounded-md bg-yellow-200 p-2 text-sm max-h-32 overflow-auto absolute">
                <p className="font-medium mb-1">Related Prompts:</p>
                <ul className="list-disc ml-5 space-y-1">
                  {relatedPrompts.map((p) => (
                    <li key={p.id}>{p.content}</li>
                  ))}
                </ul>
              </div>
            )}

            <label className="text-sm font-medium">Select Category</label>
            <select
              className="w-full border p-2 rounded-md mb-4 text-sm"
              value={modalCategory}
              onChange={(e) => setModalCategory(e.target.value)}
            >
              {categoryOptions.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <button
              onClick={handleCreatePrompt}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm"
            >
              Save Prompt
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};
