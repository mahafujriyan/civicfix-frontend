import { cn } from "@/lib/utils"
import Image from "next/image"

type CityPhotoProps = {
  src: string
  alt: string
  sizes: string
  className?: string
  eager?: boolean
}

export function CityPhoto({
  src,
  alt,
  sizes,
  className,
  eager = false,
}: CityPhotoProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={eager}
        className="civic-photo object-cover"
      />
    </div>
  )
}
