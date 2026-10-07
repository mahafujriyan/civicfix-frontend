import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

type SearchInputProps = {
  name?: string
  id?: string
  label?: string
  placeholder?: string
  defaultValue?: string
  hideLabel?: boolean
  className?: string
}

export function SearchInput({
  name = "search",
  id,
  label = "Search",
  placeholder = "Search",
  defaultValue,
  hideLabel = false,
  className,
}: SearchInputProps) {
  const inputId = id ?? `${name}-field`

  return (
    <div className={cn("relative min-w-0 flex-1", className)}>
      <Label htmlFor={inputId} className={hideLabel ? "sr-only" : "mb-2"}>
        {label}
      </Label>
      <div className="relative">
        <Search
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          aria-hidden
        />
        <Input
          id={inputId}
          name={name}
          type="search"
          placeholder={placeholder}
          defaultValue={defaultValue}
          className="pl-9"
        />
      </div>
    </div>
  )
}
