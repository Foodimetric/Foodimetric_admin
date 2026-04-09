import {
  Eye,
  Edit2,
  Trash2,
  FileText,
  BookOpen,
  User,
  Calendar,
  Heart,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { Resource } from "../types";

interface ResourceCardProps {
  item: Resource;
  onEdit: (item: Resource) => void;
  onDelete: (id: number) => void;
  onPreview: (item: Resource) => void;
}

const ResourceCard = ({
  item,
  onEdit,
  onDelete,
  onPreview,
}: ResourceCardProps) => (
  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-200">
    <div className="h-32 bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      {item.image ? (
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          {item.category === "COURSES" ? (
            <BookOpen size={32} className="text-blue-300" />
          ) : (
            <FileText size={32} className="text-blue-300" />
          )}
        </div>
      )}
      <div className="absolute top-3 right-3">
        <StatusBadge status={item.status} />
      </div>
    </div>

    <div className="p-4 space-y-2">
      <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
        {item.title}
      </h3>
      <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>

      <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
        <span className="flex items-center gap-1">
          <User size={11} /> {item.author}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={11} /> {item.date}
        </span>
        {item.status === "published" && (
          <span className="flex items-center gap-1 text-sm text-rose-400">
            <Heart size={16} className="fill-rose-400" /> {item.likes}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
        <button
          onClick={() => onPreview(item)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
        >
          <Eye size={12} /> Preview
        </button>
        <button
          onClick={() => onEdit(item)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Edit2 size={12} /> Edit
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors ml-auto"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  </div>
);

export default ResourceCard;
