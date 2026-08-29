import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "./label"
import { FaEyeSlash } from "react-icons/fa"
import { FaEye } from "react-icons/fa6"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-auto w-full rounded-md border border-input bg-background px-4 py-3 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50 text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

interface InputFieldProps extends React.ComponentProps<"input"> {
  mainContainerClassName?: string,
  label?: string,
  labelClassName?: string,
  name: string,
  containerClassName?: string,
  inputClassName?: string,
  leftIcon?: React.ReactNode,
  rightIcon?: React.ReactNode,
}


const InputField: React.FC<InputFieldProps> = ({
  mainContainerClassName,
  label,
  labelClassName,
  name,
  containerClassName,
  inputClassName,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const [isViewPass, setIsViewPass] = React.useState(true);

  return (
    <div className={cn("flex flex-col", label && 'gap-1', mainContainerClassName)} >
      {label &&
        <Label htmlFor={name} className={cn("font-medium text-sm text-neutral-950", labelClassName)}>
          {label}
        </Label>
      }
      <div className={cn("flex items-center border border-neutral-200 focus:border-primary rounded-[0.5rem] gap-1.5 px-3 py-2.5 bg-background relative ", containerClassName)}>
        {leftIcon &&
          <div className="w-5 min-w-5">
            {leftIcon}
          </div>
        }
        <Input
          {...props}
          id={name}
          name={name}
          type={!isViewPass ? 'text' : props.type}
          className={cn("p-0 border-none w-full", inputClassName)}
        />
        {rightIcon && (
          <div className="w-5 min-w-5">
            {rightIcon}
          </div>
        )}
        {props.type === "password" && (
          <button
            type="button"
            className="flex items-center w-5 min-w-5"
            onClick={() => setIsViewPass(!isViewPass)}
          >
            {
              isViewPass ?
                <FaEyeSlash className="text-neutral-600 text-lg" /> :
                <FaEye className="text-neutral-600 text-lg" />
            }
          </button>
        )}
      </div>
    </div >
  )
}


export { Input, InputField }
