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

export default function BlogEditor({ value, onChange }) {
  const [lastColor, setLastColor] = useState("#000000");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontFamily,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: "Write your blog content here..." }),
    ],
    content: value || "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },

    editorProps: {
      handleKeyDown(view, event) {
        // COPY COLOR → Ctrl+Shift+C
        if (event.ctrlKey && event.shiftKey && event.key === "C") {
          const attrs = editor.getAttributes("textStyle");
          if (attrs.color) setLastColor(attrs.color);
          event.preventDefault();
          return true;
        }
        // PASTE COLOR → Ctrl+Shift+V
        if (event.ctrlKey && event.shiftKey && event.key === "V") {
          editor.chain().focus().setColor(lastColor).run();
          event.preventDefault();
          return true;
        }

        // HEADINGS shortcuts Ctrl+1 → H1, Ctrl+2 → H2 etc
        if (event.ctrlKey && !event.shiftKey) {
          if (event.key === "1")
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          if (event.key === "2")
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          if (event.key === "3")
            editor.chain().focus().toggleHeading({ level: 3 }).run();
          if (event.key === "4")
            editor.chain().focus().toggleHeading({ level: 4 }).run();
        }

        return false;
      },
    },
    immediatelyRender: false,
  });

  // Sync content for edit mode
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="rounded-2xl border bg-background shadow mt-4">
      {/* TOOLBAR */}
      <div className="flex flex-wrap gap-1 border-b bg-muted px-3 py-2">
        {/* HEADINGS H1-H4 */}
        {[1, 2, 3, 4].map((level) => (
          <Btn
            key={level}
            tip={`H${level} (Ctrl+${level})`}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level }).run()
            }
          >
            H{level}
          </Btn>
        ))}

        <Divider />

        {/* TEXT STYLES */}
        <Btn
          tip="Bold (Ctrl+B)"
          on={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </Btn>
        <Btn
          tip="Italic (Ctrl+I)"
          on={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </Btn>
        <Btn
          tip="Underline (Ctrl+U)"
          on={() => editor.chain().focus().toggleUnderline().run()}
        >
          U
        </Btn>
        <Btn
          tip="Strike (Ctrl+Shift+S)"
          on={() => editor.chain().focus().toggleStrike().run()}
        >
          S
        </Btn>

        <Divider />

        {/* TEXT ALIGN */}
        <Btn
          tip="Align Left"
          on={() => editor.chain().focus().setTextAlign("left").run()}
        >
          ⬅
        </Btn>
        <Btn
          tip="Align Center"
          on={() => editor.chain().focus().setTextAlign("center").run()}
        >
          ⬌
        </Btn>
        <Btn
          tip="Align Right"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          ➡
        </Btn>
        <Btn
          tip="Justify"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          ☰
        </Btn>

        <Divider />

        {/* LISTS */}
        <Btn
          tip="Bullet List"
          on={() => editor.chain().focus().toggleBulletList().run()}
        >
          •
        </Btn>
        <Btn
          tip="Numbered List"
          on={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </Btn>

        <Divider />

        {/* TEXT COLOR */}
        <input
          type="color"
          title="Text Color (shortcut Ctrl+Shift+C/V)"
          onChange={(e) => {
            setLastColor(e.target.value);
            editor.chain().focus().setColor(e.target.value).run();
          }}
          className="h-8 w-8 cursor-pointer rounded border"
        />

        {/* HIGHLIGHT */}
        <input
          type="color"
          title="Highlight Color"
          onChange={(e) =>
            editor
              .chain()
              .focus()
              .toggleHighlight({ color: e.target.value })
              .run()
          }
          className="h-8 w-8 cursor-pointer rounded border"
        />

        <Divider />

        {/* LINK */}
        <Btn
          tip="Insert Link"
          onClick={() => {
            const url = prompt("Enter URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          🔗
        </Btn>

        {/* IMAGE */}
        <Btn
          tip="Insert Image"
          onClick={() => {
            const url = prompt("Image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
        >
          🖼
        </Btn>

        <Divider />

        {/* UNDO / REDO */}
        <Btn
          tip="Undo (Ctrl+Z)"
          onClick={() => editor.chain().focus().undo().run()}
        >
          ↶
        </Btn>
        <Btn
          tip="Redo (Ctrl+Y)"
          onClick={() => editor.chain().focus().redo().run()}
        >
          ↷
        </Btn>
      </div>

      {/* EDITOR CONTENT */}
      <EditorContent
        editor={editor}
        className="prose dark:prose-invert max-w-none min-h-75 px-2 py-2 focus:outline-none dark:bg-gray-800"
      />
    </div>
  );
}

// BUTTON COMPONENT WITH TOOLTIP
function Btn({ children, on, tip }) {
  return (
    <button
      type="button"
      title={tip}
      onClick={on}
      className="rounded-md px-2 py-1 text-sm font-semibold hover:bg-primary hover:text-white cursor-pointer"
    >
      {children}
    </button>
  );
}

// DIVIDER BETWEEN BUTTONS
function Divider() {
  return <div className="mx-1 h-6 w-px bg-border" />;
}
