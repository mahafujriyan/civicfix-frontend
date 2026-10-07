import { ContactForm } from "@/components/public/contact-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact",
}

export default function ContactPage() {
  return <ContactForm />
}
