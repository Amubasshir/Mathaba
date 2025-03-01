import Image from "next/image"
import { FooterLink } from "@/components/ui/footer-link"

export default function Footer() {
  return (
    <footer className="mt-auto pt-4 border-t border-gray-200 w-full flex md:block gap-5 justify-evenly">
      <div className="flex justify-center mb-2">
        <Image src="/footer-logo.svg" alt="Footer Logo" width={60} height={40} className="object-contain" />
      </div>
      <div className="">
        <div className="flex justify-center gap-4 text-sm text-[#646263] mb-2">
            <FooterLink href="#">About Us</FooterLink>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Terms of Use</FooterLink>
        </div>
        <p className="text-center text-xs text-[#646263]">All Rights Reserved. 2025</p>
      </div>
    </footer>
  )
}

