"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TurndownService from "turndown";
import { marked } from "marked";

import { Separator } from "@/components/ui/separator";
import { ToolbarProvider } from "@/components/toolbars/toolbar-provider";
import { UndoToolbar } from "@/components/toolbars/undo";
import { RedoToolbar } from "@/components/toolbars/redo";
import { BoldToolbar } from "@/components/toolbars/bold";
import { ItalicToolbar } from "@/components/toolbars/italic";
import { StrikeThroughToolbar } from "@/components/toolbars/strikethrough";
import { BulletListToolbar } from "@/components/toolbars/bullet-list";
import { OrderedListToolbar } from "@/components/toolbars/ordered-list";
import { CodeToolbar } from "@/components/toolbars/code";
import { CodeBlockToolbar } from "@/components/toolbars/code-block";
import { HorizontalRuleToolbar } from "@/components/toolbars/horizontal-rule";
import { BlockquoteToolbar } from "@/components/toolbars/blockquote";
import { HardBreakToolbar } from "@/components/toolbars/hard-break";

const turndownService = new TurndownService();

type RichTextEditorFieldProps = {
  name: string;
  label?: string;
  disabled?: boolean;
};

export function RichTextEditorField({ name, label, disabled }: RichTextEditorFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => {
        const editor = useEditor({
          extensions: [
            StarterKit.configure({
              orderedList: { HTMLAttributes: { class: "list-decimal" } },
              bulletList: { HTMLAttributes: { class: "list-disc" } },
              code: { HTMLAttributes: { class: "bg-accent rounded-md p-1" } },
              horizontalRule: { HTMLAttributes: { class: "my-2" } },
              codeBlock: {
                HTMLAttributes: {
                  class: "bg-primary text-primary-foreground p-2 text-sm rounded-md p-1"
                }
              },
              heading: {
                levels: [1, 2, 3, 4],
                HTMLAttributes: { class: "tiptap-heading" }
              }
            })
          ],
          content: marked.parse(field.value || ""),
          editable: !disabled,
          onUpdate({ editor }) {
            const html = editor.getHTML();
            const markdown = turndownService.turndown(html);
            field.onChange(markdown);
          }
        });

        useEffect(() => {
          if (editor && field.value) {
            const html = marked.parse(field.value);
            if (html !== editor.getHTML()) {
              editor.commands.setContent(html, false);
            }
          }
        }, [field.value]);

        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div className="border w-full relative rounded-md overflow-hidden pb-3">
                <div className="flex w-full items-center py-2 px-2 justify-between border-b sticky top-0 left-0 bg-background z-20">
                  <ToolbarProvider editor={editor!}>
                    <div className="flex items-center gap-2">
                      <UndoToolbar/>
                      <RedoToolbar />
                      <Separator orientation="vertical" className="h-7" />
                      <BoldToolbar />
                      <ItalicToolbar />
                      <StrikeThroughToolbar />
                      <BulletListToolbar />
                      <OrderedListToolbar />
                      <HorizontalRuleToolbar />
                      <BlockquoteToolbar />
                      <HardBreakToolbar />
                    </div>
                  </ToolbarProvider>
                </div>
                <div
                  onClick={() => editor?.chain().focus().run()}
                  className="cursor-text min-h-[18rem] bg-background"
                >
                  <EditorContent className="outline-none" editor={editor!} />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
