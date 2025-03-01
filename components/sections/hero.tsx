import Image from "next/image"

export default function Hero() {
  return (
    <div className="text-center mb-8 w-full">
      <div className="relative w-32 h-32 mx-auto mb-2">
        <Image src="/logo.svg" alt="Flow Logo" fill priority className="object-contain" />
      </div>
      <p className="text-[#646263] text-center text-lg font-medium mb-4 rtl">مساعد تقنية للاستشارات والدراسات الذكي</p>
    </div>
  )
}

