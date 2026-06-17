"use client";

import { useState } from "react";

interface SQLViewerProps {
  sql: string;
  title?: string;
}

export default function SQLViewer({ sql, title }: SQLViewerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs text-gray-400 hover:text-gray-600 font-medium cursor-pointer"
      >
        {open ? "Hide SQL" : "Show SQL"}
        {title && ` — ${title}`}
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${open ? "max-h-[600px] mt-2" : "max-h-0"}`}
      >
        <pre className="p-4 bg-[#F8F9FA] rounded-lg text-xs font-mono text-gray-700 overflow-x-auto whitespace-pre-wrap">
          <code>{sql.trim()}</code>
        </pre>
      </div>
    </div>
  );
}
