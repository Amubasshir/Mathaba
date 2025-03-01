import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import LanguageSelector from "./language-selector"

export default function LocationLanguage() {
  return (
    <div className="flex justify-center gap-4 mb-8 w-full">
      <LanguageSelector />

      <div className="flex items-center gap-1 cursor-pointer">
          <MapPin className="h-4 w-4 flex-shrink-0" />
            <Button
                variant="custom"
                className="flex-1 max-w-[160px] bg-[#c8ad0d] hover:bg-[#c8ad0d]/90 text-white py-[1px]"
                >
                <div className="flex items-center justify-center gap-2 rtl">
                <span className="text-sm">المراكز البحثية</span>
                </div>
            </Button>
        </div>
    </div>
  )
}

