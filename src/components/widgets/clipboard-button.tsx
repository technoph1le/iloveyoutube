"use client";

import useCopyClipboard from "@/hooks/use-copy-clipboard";
import { Button } from "../ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ClipboardButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  copy: string;
}

/**
 * Copy to clipboard button.
 * Provide `.relative` style to the parent element.
 */
export default function ClipboardButton({
  copy,
  className,
  ...props
}: ClipboardButtonProps) {
  const { isCopied, copyToClipboard } = useCopyClipboard();

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={() => copyToClipboard(copy)}
      className={cn("absolute top-2 right-2 z-10", className)}
      {...props}
    >
      {isCopied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  );
}
