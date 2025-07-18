"use client";

import { WrapText } from "lucide-react";
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

const HardBreakToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, onClick, children, ...props }, ref) => {
		const { editor } = useToolbar();
		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className={cn("h-8 w-8", className)}
						onClick={(e) => {
							editor?.chain().focus().setHardBreak().run();
							onClick?.(e);
						}}
						ref={ref}
						{...props}
					>
						{children || <WrapText className="h-4 w-4" />}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<span>Hard break</span>
				</TooltipContent>
			</Tooltip>
		);
	},
);

HardBreakToolbar.displayName = "HardBreakToolbar";

export { HardBreakToolbar };
