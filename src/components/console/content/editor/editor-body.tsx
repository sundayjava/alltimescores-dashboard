"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import CharacterCount from "@tiptap/extension-character-count";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { UseFormRegister, UseFormSetValue, useWatch, Control } from "react-hook-form";
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    Heading1, Heading2, Heading3, Heading4, Heading5, List, ListOrdered,
    Quote, Code, Link2, AlignLeft, AlignCenter,
    AlignRight, Undo, Redo, Minus, ImageIcon, FileCode, Type,
    Unlink, PanelLeft, X, Table as TableIcon,
} from "lucide-react";
import { ContentSchema } from "@/schemas/content.schema";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditorBodyProps {
    register: UseFormRegister<ContentSchema>;
    setValue: UseFormSetValue<ContentSchema>;
    control: Control<ContentSchema>;
    errors: { title?: { message?: string }; content?: { message?: string }; excerpt?: { message?: string } };
}

interface ToolbarItemProps {
    onClick: () => void;
    active?: boolean;
    title: string;
    icon: React.ReactNode;
    label: string;
    disabled?: boolean;
}

function ToolbarItem({ onClick, active, title, icon, label, disabled }: ToolbarItemProps) {
    return (
        <button
            type="button"
            onMouseDown={(e) => {
                e.preventDefault();
                onClick();
            }}
            title={title}
            disabled={disabled}
            className={cn(
                "flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors",
                "hover:bg-muted text-muted-foreground hover:text-foreground min-w-0",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                active && "bg-primary/10 text-primary hover:bg-primary/15"
            )}
        >
            <div className="h-5 w-5 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <span className="text-[10px] leading-none truncate w-full text-center">{label}</span>
        </button>
    );
}

const URL_SCHEME_RE = /^([a-z][a-z0-9+.-]*:|\/|#)/i;

function normalizeUrl(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return "";
    return URL_SCHEME_RE.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function LinkPopover({ editor }: { editor: Editor | null }) {
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState("");
    const isActive = editor?.isActive("link") ?? false;

    const applyLink = () => {
        if (!editor) return;
        const href = normalizeUrl(url);
        if (!href) {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            setOpen(false);
            return;
        }
        const chain = editor.chain().focus();
        if (editor.state.selection.empty) {
            chain
                .insertContent({
                    type: "text",
                    text: href.replace(/^https?:\/\//, ""),
                    marks: [{ type: "link", attrs: { href } }],
                })
                .run();
        } else {
            chain.extendMarkRange("link").setLink({ href }).run();
        }
        setOpen(false);
    };

    const removeLink = () => {
        editor?.chain().focus().extendMarkRange("link").unsetLink().run();
        setOpen(false);
    };

    return (
        <Popover
            open={open}
            onOpenChange={(next) => {
                if (!next) editor?.chain().focus().run();
                setOpen(next);
            }}
        >
            <PopoverTrigger
                disabled={!editor}
                data-keep-toolbar-open
                onClick={() => setUrl(editor?.getAttributes("link").href ?? "")}
                className={cn(
                    "flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors",
                    "hover:bg-muted text-muted-foreground hover:text-foreground min-w-0",
                    "disabled:opacity-40 disabled:cursor-not-allowed",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/15"
                )}
            >
                <div className="h-5 w-5 flex items-center justify-center shrink-0">
                    <Link2 className="h-4 w-4" />
                </div>
                <span className="text-[10px] leading-none truncate w-full text-center">Link</span>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        applyLink();
                    }}
                    className="flex flex-col gap-2"
                >
                    <label className="text-xs font-medium text-muted-foreground">
                        {isActive ? "Edit link" : "Insert link"}
                    </label>
                    <Input
                        autoFocus
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        onKeyDown={(e) => {
                            if (e.key === "Escape") {
                                e.preventDefault();
                                setOpen(false);
                            }
                        }}
                    />
                    <div className="flex items-center justify-between gap-2">
                        {isActive ? (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={removeLink}
                                className="text-destructive hover:text-destructive"
                            >
                                <Unlink className="h-3.5 w-3.5" />
                                Remove
                            </Button>
                        ) : (
                            <span />
                        )}
                        <Button type="submit" size="sm">
                            Apply
                        </Button>
                    </div>
                </form>
            </PopoverContent>
        </Popover>
    );
}

function ToolbarSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2">
                {title}
            </h3>
            <div className="grid grid-cols-4 gap-1 px-2">
                {children}
            </div>
        </div>
    );
}

export function EditorBody({
    register,
    setValue,
    control,
    errors,
}: EditorBodyProps) {
    const contentValue = useWatch({ control, name: "content" });
    const isInternalUpdate = useRef(false);
    const [toolbarOpen, setToolbarOpen] = useState(false);

    // Extensions and editorProps must stay referentially stable across renders.
    // Tiptap's useEditor (deps=[]) re-diffs `options` on every render and calls
    // editor.setOptions(...) whenever anything differs — inline extension/prop
    // literals are new objects each render, so that comparison never matched,
    // firing a live reconfigure (incl. re-parsing content) on every keystroke.
    const extensions = useMemo(
        () => [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5],
                },
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                    HTMLAttributes: {
                        class: 'list-disc',
                    },
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                    HTMLAttributes: {
                        class: 'list-decimal',
                    },
                },
                blockquote: {
                    HTMLAttributes: {
                        class: 'blockquote',
                    },
                },
                codeBlock: {
                    HTMLAttributes: {
                        class: 'code-block',
                    },
                },
                horizontalRule: {
                    HTMLAttributes: {
                        class: 'horizontal-rule',
                    },
                },
            }),
            Placeholder.configure({
                placeholder: "Start writing or use markdown shortcuts (# for headings, - for bullets, > for quotes)…",
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                autolink: true,
                linkOnPaste: true,
                protocols: ["http", "https", "mailto", "tel"],
                HTMLAttributes: {
                    class: "text-primary underline underline-offset-2 hover:text-primary/80 cursor-pointer",
                    rel: "noopener noreferrer",
                    target: "_blank",
                },
            }),
            Image.configure({
                allowBase64: true,
                HTMLAttributes: {
                    class: "rounded-lg max-w-full h-auto"
                },
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
                alignments: ["left", "center", "right"],
            }),
            CharacterCount,
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: "content-table",
                },
            }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        []
    );

    const editorProps = useMemo(
        () => ({
            attributes: {
                class: "prose prose-base dark:prose-invert max-w-none min-h-[500px] focus:outline-none",
            },
        }),
        []
    );

    const editor = useEditor({
        extensions,
        immediatelyRender: true,
        editorProps,
        onUpdate: ({ editor }) => {
            isInternalUpdate.current = true;
            setValue("content", editor.getHTML(), { shouldDirty: true });
        },
    });

    // Sync external content changes only (e.g. when loading an existing article).
    // Tiptap's setContent emits onUpdate by default, which would otherwise feed
    // back into this effect on every keystroke and reset the live selection —
    // isInternalUpdate distinguishes edits that originated in the editor itself.
    useEffect(() => {
        if (!editor) return;
        if (isInternalUpdate.current) {
            isInternalUpdate.current = false;
            return;
        }
        if (contentValue !== undefined && contentValue !== editor.getHTML()) {
            editor.commands.setContent(contentValue ?? "", { emitUpdate: false });
        }
    }, [editor, contentValue]);

    const insertTable = () => {
        if (!editor) return;
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    };

    const addImage = () => {
        if (!editor) return;
        const url = window.prompt("Enter image URL:");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const wordCount = editor?.storage.characterCount?.words() ?? 0;
    const charCount = editor?.storage.characterCount?.characters() ?? 0;

    return (
        <div className="flex h-full bg-background w-full">
            {/* Mobile backdrop */}
            {toolbarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 lg:hidden"
                    onClick={() => setToolbarOpen(false)}
                />
            )}

            {/* Left Sidebar - WordPress Block Style */}
            <div
                className={cn(
                    "fixed top-14 bottom-0 left-0 z-40 w-72 max-w-[85vw] shrink-0 border-r border-border bg-card overflow-y-auto transition-transform duration-200 ease-in-out",
                    "lg:static lg:top-auto lg:bottom-auto lg:z-auto lg:translate-x-0",
                    toolbarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-between px-4 pt-4 lg:hidden">
                    <p className="text-sm font-semibold">Formatting</p>
                    <button
                        type="button"
                        onClick={() => setToolbarOpen(false)}
                        className="p-1 text-muted-foreground hover:text-foreground"
                        aria-label="Close formatting panel"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div
                    className="p-4 space-y-6"
                    onClick={(e) => {
                        const button = (e.target as HTMLElement).closest("button");
                        if (button && !button.hasAttribute("data-keep-toolbar-open")) {
                            setToolbarOpen(false);
                        }
                    }}
                >
                    {/* Markdown Info */}
                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-xs space-y-1">
                        <p className="font-semibold text-foreground mb-1">Markdown Shortcuts</p>
                        <p className="text-muted-foreground leading-relaxed">
                            Type <code className="bg-primary/10 px-1 rounded">#</code> for H1,
                            <code className="bg-primary/10 px-1 rounded mx-1">##</code> for H2, etc.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Use <code className="bg-primary/10 px-1 rounded">-</code> or
                            <code className="bg-primary/10 px-1 rounded mx-1">*</code> for bullets,
                            <code className="bg-primary/10 px-1 rounded">1.</code> for numbers
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Start with <code className="bg-primary/10 px-1 rounded">&gt;</code> for quotes
                        </p>
                    </div>

                    {/* Text Formatting */}
                    <ToolbarSection title="Format">
                        <ToolbarItem
                            onClick={() => editor?.chain().focus().setParagraph().run()}
                            active={editor?.isActive("paragraph")}
                            title="Paragraph"
                            icon={<Type className="h-4 w-4" />}
                            label="Paragraph"
                        />
                        <ToolbarItem
                            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                            active={editor?.isActive("heading", { level: 1 })}
                            title="Heading 1"
                            icon={<Heading1 className="h-4 w-4" />}
                            label="Heading 1"
                        />
                        <ToolbarItem
                            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                            active={editor?.isActive("heading", { level: 2 })}
                            title="Heading 2"
                            icon={<Heading2 className="h-4 w-4" />}
                            label="Heading 2"
                        />
                        <ToolbarItem
                            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                            active={editor?.isActive("heading", { level: 3 })}
                            title="Heading 3"
                            icon={<Heading3 className="h-4 w-4" />}
                            label="Heading 3"
                        />
                        <ToolbarItem
                            onClick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}
                            active={editor?.isActive("heading", { level: 4 })}
                            title="Heading 4"
                            icon={<Heading4 className="h-4 w-4" />}
                            label="Heading 4"
                        />
                        <ToolbarItem
                            onClick={() => editor?.chain().focus().toggleHeading({ level: 5 }).run()}
                            active={editor?.isActive("heading", { level: 5 })}
                            title="Heading 5"
                            icon={<Heading5 className="h-4 w-4" />}
                            label="Heading 5"
                        />
                        <ToolbarItem
                            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                            active={editor?.isActive("blockquote")}
                            title="Blockquote"
                            icon={<Quote className="h-4 w-4" />}
                            label="Quote"
                        />
                        <ToolbarItem
                            onClick={() => editor?.chain().focus().toggleCode().run()}
                            active={editor?.isActive("code")}
                            title="Inline Code"
                            icon={<Code className="h-4 w-4" />}
                            label="Code"
                        />
                    </ToolbarSection>

                    {/* Text Style */}
                    <ToolbarSection title="Style">
                        <ToolbarItem
                            onClick={() => editor?.chain().focus().toggleBold().run()}
                            active={editor?.isActive("bold")}
                            title="Bold (Ctrl+B)"
                            icon={<Bold className="h-4 w-4" />}
                            label="Bold"
                        />
                        <ToolbarItem
                            onClick={() => editor?.chain().focus().toggleItalic().run()}
                            active={editor?.isActive("italic")}
                            title="Italic (Ctrl+I)"
                            icon={<Italic className="h-4 w-4" />}
                            label="Italic"
                        />
                        <ToolbarItem
                            onClick={() => editor?.chain().focus().toggleUnderline().run()}
                            active={editor?.isActive("underline")}
                            title="Underline (Ctrl+U)"
                            icon={<UnderlineIcon className="h-4 w-4" />}
                            label="Underline"
                        />
                        <ToolbarItem
                            onClick={() => editor?.chain().focus().toggleStrike().run()}
                            active={editor?.isActive("strike")}
                            title="Strikethrough"
                            icon={<Strikethrough className="h-4 w-4" />}
                            label="Strike"
                        />
                        <ToolbarItem
                            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                            active={editor?.isActive("codeBlock")}
                            title="Code Block"
                            icon={<FileCode className="h-4 w-4" />}
                            label="Code Block"
                        />
                    </ToolbarSection>

                    {/* Lists */}
                    <ToolbarSection title="Lists">
                        <ToolbarItem
                            onClick={() => editor?.chain().focus().toggleBulletList().run()}
                            active={editor?.isActive("bulletList")}
                            title="Bullet List"
                            icon={<List className="h-4 w-4" />}
                            label="Bullets"
                        />
                        <ToolbarItem
                            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                            active={editor?.isActive("orderedList")}
                            title="Numbered List"
                            icon={<ListOrdered className="h-4 w-4" />}
                            label="Numbers"
                        />
                    </ToolbarSection>

                    {/* Alignment */}
                    <ToolbarSection title="Align">
                        <ToolbarItem
                            onClick={() => editor?.chain().focus().setTextAlign("left").run()}
                            active={editor?.isActive({ textAlign: "left" })}
                            title="Align Left"
                            icon={<AlignLeft className="h-4 w-4" />}
                            label="Left"
                        />
                        <ToolbarItem
                            onClick={() => editor?.chain().focus().setTextAlign("center").run()}
                            active={editor?.isActive({ textAlign: "center" })}
                            title="Align Center"
                            icon={<AlignCenter className="h-4 w-4" />}
                            label="Center"
                        />
                        <ToolbarItem
                            onClick={() => editor?.chain().focus().setTextAlign("right").run()}
                            active={editor?.isActive({ textAlign: "right" })}
                            title="Align Right"
                            icon={<AlignRight className="h-4 w-4" />}
                            label="Right"
                        />
                    </ToolbarSection>

                    {/* Media */}
                    <ToolbarSection title="Media">
                        <LinkPopover editor={editor} />
                        <ToolbarItem
                            onClick={addImage}
                            title="Insert Image"
                            icon={<ImageIcon className="h-4 w-4" />}
                            label="Image"
                        />
                        <ToolbarItem
                            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                            title="Horizontal Rule"
                            icon={<Minus className="h-4 w-4" />}
                            label="Divider"
                        />
                        <ToolbarItem
                            onClick={insertTable}
                            active={editor?.isActive("table")}
                            title="Insert Table"
                            icon={<TableIcon className="h-4 w-4" />}
                            label="Table"
                        />
                    </ToolbarSection>

                    {/* History */}
                    <ToolbarSection title="History">
                        <ToolbarItem
                            onClick={() => editor?.chain().focus().undo().run()}
                            disabled={!editor?.can().undo()}
                            title="Undo (Ctrl+Z)"
                            icon={<Undo className="h-4 w-4" />}
                            label="Undo"
                        />
                        <ToolbarItem
                            onClick={() => editor?.chain().focus().redo().run()}
                            disabled={!editor?.can().redo()}
                            title="Redo (Ctrl+Shift+Z)"
                            icon={<Redo className="h-4 w-4" />}
                            label="Redo"
                        />
                    </ToolbarSection>
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile formatting toggle */}
                <div className="flex items-center border-b border-border bg-background px-4 py-2 lg:hidden">
                    <button
                        type="button"
                        onClick={() => setToolbarOpen(true)}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <PanelLeft className="h-4 w-4" />
                        Formatting
                    </button>
                </div>

                {/* Title & Excerpt Header */}
                <div className="border-b border-border bg-background">
                    <div className="px-8 pt-8 pb-4 max-w-4xl mx-auto w-full">
                        <textarea
                            {...register("title")}
                            placeholder="Add title"
                            rows={1}
                            className={cn(
                                "w-full resize-none bg-transparent text-4xl font-bold leading-tight",
                                "placeholder:text-muted-foreground/30 focus:outline-none",
                                "border-0 p-0 shadow-none ring-0",
                                errors.title && "placeholder:text-destructive/40"
                            )}
                            onInput={(e) => {
                                const target = e.currentTarget;
                                target.style.height = "auto";
                                target.style.height = target.scrollHeight + "px";
                            }}
                        />
                        {errors.title && (
                            <p className="text-xs text-destructive mt-1">{errors.title.message}</p>
                        )}

                        {/* Excerpt */}
                        <textarea
                            {...register("excerpt")}
                            placeholder="Write an excerpt (optional)…"
                            rows={2}
                            className={cn(
                                "w-full resize-none bg-transparent text-base text-muted-foreground leading-relaxed mt-3",
                                "placeholder:text-muted-foreground/30 focus:outline-none",
                                "border-0 p-0 shadow-none ring-0"
                            )}
                        />
                    </div>
                </div>

                {/* Editor Content */}
                <div className="flex-1 overflow-y-auto bg-background">
                    <div className="px-8 py-8 max-w-4xl mx-auto w-full">
                        <EditorContent
                            editor={editor}
                            className="editor-content"
                        />
                        {errors.content && (
                            <p className="text-xs text-destructive mt-2">{errors.content.message}</p>
                        )}
                    </div>
                </div>

                {/* Bottom Stats Bar */}
                <div className="border-t border-border px-8 py-2.5 bg-muted/30 shrink-0">
                    <div className="text-xs text-muted-foreground tabular-nums flex items-center gap-3 max-w-4xl mx-auto w-full">
                        <span>{wordCount.toLocaleString()} words</span>
                        <span className="text-border">·</span>
                        <span>{charCount.toLocaleString()} characters</span>
                    </div>
                </div>
            </div>
        </div>
    );
}