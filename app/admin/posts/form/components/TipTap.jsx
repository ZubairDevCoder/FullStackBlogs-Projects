"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import FontFamily from "@tiptap/extension-font-family";
import Placeholder from "@tiptap/extension-placeholder";
import HardBreak from "@tiptap/extension-hard-break";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { lowlight } from "lowlight";

// Highlight.js languages
import javascript from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";
import html from "highlight.js/lib/languages/xml";
import json from "highlight.js/lib/languages/json";

// Register languages
lowlight.registerLanguage("javascript", javascript);
lowlight.registerLanguage("css", css);
lowlight.registerLanguage("html", html);
lowlight.registerLanguage("json", json);

export default function TipTapSSR({ value, onChange }) {
  const [editorMounted, setEditorMounted] = useState(false);
  const [lastColor, setLastColor] = useState("#000000");
  const [copiedColor, setCopiedColor] = useState(null);

  useEffect(() => {
    setEditorMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      TextStyle,
      FontFamily,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      Image.configure({ allowBase64: true }),
      HardBreak,
      HorizontalRule,
      Blockquote,
      CodeBlockLowlight.configure({ lowlight }),
      Placeholder.configure({ placeholder: "Write your blog content here..." }),
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      handleKeyDown(view, event) {
        if (!editor) return false;
        const meta = event.metaKey || event.ctrlKey;

        // Bold / Italic / Underline
        if (meta && event.key === "b") {
          editor.chain().focus().toggleBold().run();
          event.preventDefault();
          return true;
        }
        if (meta && event.key === "i") {
          editor.chain().focus().toggleItalic().run();
          event.preventDefault();
          return true;
        }
        if (meta && event.key === "u") {
          editor.chain().focus().toggleUnderline().run();
          event.preventDefault();
          return true;
        }

        // Headings Ctrl+1..4
        if (meta && ["1", "2", "3", "4"].includes(event.key)) {
          editor
            .chain()
            .focus()
            .toggleHeading({ level: parseInt(event.key) })
            .run();
          event.preventDefault();
          return true;
        }

        // Align Ctrl+L/C/R
        if (meta && event.key.toLowerCase() === "l") {
          editor.chain().focus().setTextAlign("left").run();
          event.preventDefault();
          return true;
        }
        if (meta && event.key.toLowerCase() === "c") {
          editor.chain().focus().setTextAlign("center").run();
          event.preventDefault();
          return true;
        }
        if (meta && event.key.toLowerCase() === "r") {
          editor.chain().focus().setTextAlign("right").run();
          event.preventDefault();
          return true;
        }

        // Copy / Paste color Ctrl+Alt+X / Ctrl+Alt+V
        if (meta && event.altKey && event.key.toLowerCase() === "x") {
          const attrs = editor.getAttributes("textStyle");
          if (attrs.color) setCopiedColor(attrs.color);
          event.preventDefault();
          return true;
        }
        if (meta && event.altKey && event.key.toLowerCase() === "v") {
          if (copiedColor) editor.chain().focus().setColor(copiedColor).run();
          event.preventDefault();
          return true;
        }

        return false;
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML())
      editor.commands.setContent(value || "");
  }, [value, editor]);

  if (!editorMounted || !editor) return null;

  return (
    <div className="rounded-2xl border shadow mt-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b bg-muted px-3 py-2">
        {[1, 2, 3, 4].map((level) => (
          <Btn
            key={level}
            tip={`Heading H${level} (Ctrl+${level})`}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level }).run()
            }
          >
            H{level}
          </Btn>
        ))}

        <Divider />

        <Btn
          tip="Bold (Ctrl+B)"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </Btn>
        <Btn
          tip="Italic (Ctrl+I)"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </Btn>
        <Btn
          tip="Underline (Ctrl+U)"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          U
        </Btn>

        <Divider />

        <Btn
          tip="Align Left (Ctrl+L)"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          ⬅
        </Btn>
        <Btn
          tip="Align Center (Ctrl+C)"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          ⬌
        </Btn>
        <Btn
          tip="Align Right (Ctrl+R)"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          ➡
        </Btn>

        <Divider />

        {/* Color Picker */}
        <input
          type="color"
          value={lastColor}
          onChange={(e) => {
            setLastColor(e.target.value);
            editor.chain().focus().setColor(e.target.value).run();
          }}
          className="h-8 w-8 cursor-pointer rounded"
          title="Text Color"
        />

        {/* Copy / Paste Color */}
        <Btn
          tip="Copy Selected Color (Ctrl+Alt+X)"
          onClick={() => {
            const attrs = editor.getAttributes("textStyle");
            if (attrs.color) {
              setCopiedColor(attrs.color);
              alert(`Color copied: ${attrs.color}`);
            } else {
              alert("No color selected");
            }
          }}
        >
          🎨 Copy
        </Btn>
        <Btn
          tip="Paste Copied Color (Ctrl+Alt+V)"
          onClick={() => {
            if (copiedColor) editor.chain().focus().setColor(copiedColor).run();
          }}
        >
          🎯 Paste
        </Btn>

        <Divider />

        <Btn
          tip="Code Block"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >{`</>`}</Btn>
        <Btn
          tip="Clear Formatting"
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
        >
          ✖
        </Btn>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="prose max-w-none min-h-[300px] px-4 py-3 focus:outline-none dark:prose-invert dark:text-white code-block-style"
      />

      <style jsx>{`
        /* VS Code-like code block theme */
        .code-block-style pre {
          background: #1e1e1e;
          color: #d4d4d4;
          font-family: "Fira Code", monospace;
          font-size: 14px;
          padding: 12px;
          border-radius: 8px;
          overflow-x: auto;
        }
        .code-block-style code {
          font-family: "Fira Code", monospace;
        }
        /* Syntax colors */
        .code-block-style .hljs-keyword {
          color: #569cd6;
        }
        .code-block-style .hljs-string {
          color: #d69d85;
        }
        .code-block-style .hljs-number {
          color: #b5cea8;
        }
        .code-block-style .hljs-comment {
          color: #6a9955;
          font-style: italic;
        }
        .code-block-style .hljs-function {
          color: #dcdcaa;
        }
        .code-block-style .hljs-title {
          color: #4ec9b0;
        }
        .code-block-style .hljs-attr {
          color: #9cdcfe;
        }
      `}</style>
    </div>
  );
}

function Btn({ children, onClick, tip }) {
  return (
    <button
      type="button"
      title={tip}
      onClick={onClick}
      className="rounded-md px-2 py-1 text-sm font-semibold hover:bg-primary hover:text-white transition-colors"
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-6 w-px bg-border" />;
}
  