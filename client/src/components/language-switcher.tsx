import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "de" ? "en" : "de")}
      className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 hover:bg-gray-800/50"
    >
      <Globe className="w-4 h-4" />
      <span className="font-medium">{language === "de" ? "DE" : "EN"}</span>
    </Button>
  );
}