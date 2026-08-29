import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "./label"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2  ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 text-sm resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

interface TextareaFieldProps extends React.ComponentProps<"textarea"> {
  mainContainerClassName?: string,
  label?: string,
  labelClassName?: string,
  name: string,
  containerClassName?: string,
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  mainContainerClassName,
  label,
  labelClassName,
  name,
  containerClassName,
  ...props
}) => {
  return (
    <div className={cn("flex flex-col", label && 'gap-1', mainContainerClassName)} >
      {label &&
        <Label
          htmlFor={name}
          className={cn("font-medium text-sm text-neutral-950", labelClassName)}
        >
          {label}
        </Label>
      }
      <Textarea
        name={name}
        {...props}
      />
    </div>
  )
}

export { Textarea, TextareaField}
