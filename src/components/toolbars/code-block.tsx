"use client";

import { Code, Code2 } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToolbar } from "@/components/toolbars/toolbar-provider";

const CodeBlockToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, onClick, children, ...props }, ref) => {
		const { editor } = useToolbar();
		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className={cn(
							"h-8 w-8",
							editor?.isActive("codeBlock") && "bg-accent",
							className,
						)}
						onClick={(e) => {
							editor?.chain().focus().toggleCodeBlock().run();
							onClick?.(e);
						}}
						disabled={!editor?.can().chain().focus().toggleCodeBlock().run()}
						ref={ref}
						{...props}
					>
						{children || <Code className="h-4 w-4" />}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<span>Code Block</span>
				</TooltipContent>
			</Tooltip>
		);
	},
);

CodeBlockToolbar.displayName = "CodeBlockToolbar";

export { CodeBlockToolbar };
