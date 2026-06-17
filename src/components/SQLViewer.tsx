"use client";

import { useState } from "react";

interface SQLViewerProps {
  sql: string;
}

export default function SQLViewer({ sql }: SQLViewerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm text-[#40916C] hover:text-[#2D6A4F] font-medium flex items-center gap-1 cursor-pointer"
      >
        <span className="text-xs">{open ? "▼" : "▶"}</span>
        {open ? "Hide SQL" : "Show SQL"}
      </button>
      {open && (
        <pre className="mt-2 p-4 bg-[#F5F5F5] rounded-lg text-xs font-mono text-[#1a1a1a] overflow-x-auto border border-[#E8E8E8]">
          <code>{sql.trim()}</code>
        </pre>
      )}
    </div>
  );
}
