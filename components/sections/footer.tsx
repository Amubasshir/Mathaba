import { FooterLink } from '@/components/ui/footer-link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="mt-auto pt-4 border-t border-gray-200 w-full flex md:block gap-5 justify-evenly">
      <div className="flex justify-center mb-2">
        <Image
          src="/mathabh.png"
          alt="Footer Logo"
          width={40}
          height={30}
          className="object-contain"
        />
      </div>
      <div className="">
        <div className="flex justify-center gap-4 text-sm text-[#646263] mb-2">
          <FooterLink href="#">About Us</FooterLink>
          <FooterLink href="#">Privacy Policy</FooterLink>
          <FooterLink href="terms-and-conditions">Terms of Use</FooterLink>
        </div>
        <p className="text-center text-xs text-[#646263]">
          All Rights Reserved. 2025
        </p>
      </div>
    </footer>
  );
}
