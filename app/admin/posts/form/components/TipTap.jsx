"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { TextAlign } from "@tiptap/extension-text-align";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { FontFamily } from "@tiptap/extension-font-family";
import { Placeholder } from "@tiptap/extension-placeholder";
import { HardBreak } from "@tiptap/extension-hard-break";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { Blockquote } from "@tiptap/extension-blockquote";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { lowlight } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";
import html from "highlight.js/lib/languages/xml";
import json from "highlight.js/lib/languages/json";
import copy from "copy-to-clipboard";

// Register languages
lowlight.registerLanguage("js", javascript);
lowlight.registerLanguage("css", css);
lowlight.registerLanguage("html", html);
lowlight.registerLanguage("json", json);

export default function TipTapSSR({ value, onChange }) {
  const [lastColor, setLastColor] = useState("#000000");

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
      Image.configure({ inline: false, allowBase64: true }),
      HardBreak.configure({ keepMarks: true }),
      HorizontalRule,
      Blockquote,
      CodeBlockLowlight.configure({ lowlight }),
      Placeholder.configure({ placeholder: "Write your blog content here..." }),
    ],

    content: value || "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },

    editorProps: {
      handleKeyDown(view, event) {
        if (event.ctrlKey && event.shiftKey && event.key === "C") {
          const attrs = editor.getAttributes("textStyle");
          if (attrs.color) setLastColor(attrs.color);
          event.preventDefault();
          return true;
        }
        if (event.ctrlKey && event.shiftKey && event.key === "V") {
          editor.chain().focus().setColor(lastColor).run();
          event.preventDefault();
          return true;
        }
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
        if (event.ctrlKey && event.shiftKey && event.key === "K") {
          editor.chain().focus().toggleCodeBlock().run();
          event.preventDefault();
          return true;
        }
        return false;
      },
    },

    immediatelyRender: false, // ✅ SSR-safe
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML())
      editor.commands.setContent(value || "");
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="rounded-2xl border bg-background shadow mt-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b bg-muted px-3 py-2">
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
        <Btn
          tip="Medium"
          onClick={() =>
            editor
              .chain()
              .focus()
              .setMark("textStyle", { fontWeight: "500" })
              .run()
          }
        >
          M
        </Btn>
        <Btn
          tip="SemiBold"
          onClick={() =>
            editor
              .chain()
              .focus()
              .setMark("textStyle", { fontWeight: "600" })
              .run()
          }
        >
          SB
        </Btn>
        <Btn
          tip="Bold (Ctrl+B)"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </Btn>

        <Divider />
        <Btn
          tip="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </Btn>
        <Btn
          tip="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          U
        </Btn>
        <Btn
          tip="Strike"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          S
        </Btn>

        <Divider />
        <Btn
          tip="Left"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          ⬅
        </Btn>
        <Btn
          tip="Center"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          ⬌
        </Btn>
        <Btn
          tip="Right"
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
        <Btn
          tip="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          •
        </Btn>
        <Btn
          tip="Numbered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </Btn>

        <Divider />
        <input
          type="color"
          title="Text Color"
          onChange={(e) => {
            setLastColor(e.target.value);
            editor.chain().focus().setColor(e.target.value).run();
          }}
          className="h-8 w-8 cursor-pointer rounded border"
        />
        <input
          type="color"
          title="Highlight"
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
        <Btn
          tip="Link"
          onClick={() => {
            const url = prompt("Enter URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          🔗
        </Btn>
        <Btn
          tip="Image"
          onClick={() => {
            const url = prompt("Image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
        >
          🖼
        </Btn>

        <Divider />
        <Btn
          tip="Code Block (Ctrl+Shift+K)"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          {"</>"}
        </Btn>
        <Btn
          tip="Blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          ❝
        </Btn>
        <Btn
          tip="Horizontal Rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          ―
        </Btn>
        <Btn
          tip="Clear All"
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        >
          ✖
        </Btn>

        <Divider />
        <Btn tip="Undo" onClick={() => editor.chain().focus().undo().run()}>
          ↶
        </Btn>
        <Btn tip="Redo" onClick={() => editor.chain().focus().redo().run()}>
          ↷
        </Btn>
      </div>

      <EditorContent
        editor={editor}
        className="prose dark:prose-invert max-w-none min-h-[300px] px-4 py-3 focus:outline-none dark:bg-gray-900"
      />
    </div>
  );
}

function Btn({ children, on, tip }) {
  return (
    <button
      type="button"
      title={tip}
      onClick={on}
      className="rounded-md px-2 py-1 text-sm font-semibold hover:bg-primary hover:text-white"
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-6 w-px bg-border" />;
}
