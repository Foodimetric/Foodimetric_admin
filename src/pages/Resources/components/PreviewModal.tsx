import { Heart, X } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { Resource } from "../types";

interface PreviewModalProps {
  item: Resource;
  onClose: () => void;
}

const PreviewModal = ({ item, onClose }: PreviewModalProps) => (
  <div className="fixed inset-0 -top-10 z-50 bg-black/40 flex items-start justify-center p-4 overflow-y-auto">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-20">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <StatusBadge status={item.status} />
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            {item.category}
          </span>
          {item.status === "published" && (
            <span className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-50 px-2 py-1 rounded-full">
              <Heart size={11} className="fill-rose-400" /> {item.likes}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
        >
          <X size={18} />
        </button>
      </div>

      {/* Cover Image */}
      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-52 object-cover"
        />
      )}

      {/* Content */}
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900 leading-snug mb-2">
          {item.title}
        </h1>
        <p className="text-sm text-gray-500 mb-1">
          By <span className="font-medium text-gray-700">{item.author}</span>{" "}
          &middot; {item.date}
        </p>
        <p className="text-sm text-gray-600 mb-5 border-l-4 border-blue-200 pl-3 italic">
          {item.description}
        </p>

        <div
          className="prose prose-sm max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      </div>
    </div>
  </div>
);

export default PreviewModal;
