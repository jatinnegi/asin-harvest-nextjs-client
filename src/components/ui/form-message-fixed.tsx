// components/ui/form-message-always.tsx
import React from "react";
import { useFormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";

export const FormMessageFixed = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message ?? "") : children;

  if (!body) {
    return <></>;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn(
        "text-sm font-medium min-h-5",
        error ? "text-destructive" : "text-muted-foreground/70",
        className,
      )}
      {...props}
    >
      {body || ""}
    </p>
  );
});
FormMessageFixed.displayName = "FormMessageFixed";
