export { cn } from "cn"

export function humanizeToken(value: string): string {
  const words = value
    .trim()
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter((part) => part.length > 0)

  return words
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}
