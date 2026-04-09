import { useState } from "react";
import { Code, Monitor, AlignLeft } from "lucide-react";
import clsx from "clsx";

interface ContentEditorProps {
  value: string;
  onChange: (val: string) => void;
}

const ContentEditor = ({ value, onChange }: ContentEditorProps) => {
  const [editorMode, setEditorMode] = useState<"code" | "preview">("code");

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-3 py-2">
        <span className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
          <AlignLeft size={12} /> Content (HTML)
        </span>
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5">
          <button
            onClick={() => setEditorMode("code")}
            className={clsx(
              "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition-colors",
              editorMode === "code"
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            <Code size={11} /> Code
          </button>
          <button
            onClick={() => setEditorMode("preview")}
            className={clsx(
              "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition-colors",
              editorMode === "preview"
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            <Monitor size={11} /> Preview
          </button>
        </div>
      </div>

      {/* Editor / Preview */}
      {editorMode === "code" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-64 p-4 text-sm font-mono text-green-400 bg-gray-950 resize-none focus:outline-none leading-relaxed"
          placeholder="<div><p>Enter your HTML content here...</p></div>"
          spellCheck={false}
        />
      ) : (
        <div className="h-64 overflow-y-auto p-5 bg-white">
          {value ? (
            <div
              className="prose prose-sm max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300 text-sm">
              Nothing to preview yet
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentEditor;
