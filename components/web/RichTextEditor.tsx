"use client";

import dynamic from "next/dynamic";
import { useMemo, useCallback } from "react";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote", "code-block"],
  ["link"],
  ["clean"],
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: TOOLBAR_OPTIONS,
      clipboard: {
        matchVisual: false,
        // Better paste handling to prevent freezing
        matchers: [
          [
            1, // Node.ELEMENT_NODE
            (node: Element, delta: any) => {
              // Strip out problematic formatting on paste
              const plaintext = node.textContent || "";
              return delta.compose({ ops: [{ insert: plaintext }] });
            },
          ],
        ],
      },
      keyboard: {
        bindings: {
          // Fix quote handling
          smartQuote: {
            key: 222, // Quote key
            handler: function (this: any, range: any) {
              const quill = this.quill;
              quill.insertText(range.index, '"', "user");
              quill.setSelection(range.index + 1);
              return false;
            },
          },
        },
      },
    }),
    [],
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "blockquote",
    "code-block",
    "link",
  ];

  // Debounced onChange to prevent freezing
  const handleChange = useCallback(
    (content: string) => {
      // Use requestAnimationFrame to prevent blocking
      requestAnimationFrame(() => {
        onChange(content);
      });
    },
    [onChange],
  );

  return (
    <div className="rich-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        preserveWhitespace
      />
    </div>
  );
}
