import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Plus, User } from "lucide-react";
import { useState } from "react";
import CatchLogModal from "@/components/catch-log-modal";
import { useLanguage } from "@/contexts/language-context";
import { useScrollHide } from "@/hooks/use-scroll-hide";
const homeIcon = "/icons/file_00000000f6186246a8136bebf875e096_1754053799824.png";
const mapIcon = "/icons/icon_4_1754053799779.png";
const fangbuchIcon = "/icons/icon_2_1754053799796.png";

export default function BottomNavigation() {
  const [location] = useLocation();
  const [showCatchModal, setShowCatchModal] = useState(false);
  const { t } = useLanguage();
  const isVisible = useScrollHide(50);

  const isActive = (path: string) => location === path;

  return (
    <>
      <nav className={`fixed bottom-0 left-0 right-0 bg-gray-900/50 backdrop-blur-sm border-t border-cyan-500/20 px-4 py-2 z-40 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="flex items-center justify-around">
          <Link href="/home">
            <button className={cn(
              "flex flex-col items-center space-y-1 transition-colors",
              isActive("/home") ? "text-cyan-400" : "text-gray-400 hover:text-cyan-400"
            )}>
              <img src={homeIcon} className="w-5 h-5 object-contain" alt={t("nav.home")} />
              <span className="text-xs font-medium">{t("nav.home")}</span>
            </button>
          </Link>
          
          <Link href="/map">
            <button className={cn(
              "flex flex-col items-center space-y-1 transition-colors",
              isActive("/map") ? "text-cyan-400" : "text-gray-400 hover:text-cyan-400"
            )}>
              <img src={mapIcon} className="w-5 h-5 object-contain" alt={t("nav.map")} />
              <span className="text-xs font-medium">{t("nav.map")}</span>
            </button>
          </Link>
          
          <button 
            className="flex flex-col items-center space-y-1 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-xl px-4 py-2"
            onClick={() => setShowCatchModal(true)}
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs font-medium">{t("nav.log")}</span>
          </button>
          
          <Link href="/logbook">
            <button className={cn(
              "flex flex-col items-center space-y-1 transition-colors",
              isActive("/logbook") ? "text-cyan-400" : "text-gray-400 hover:text-cyan-400"
            )}>
              <img src={fangbuchIcon} className="w-5 h-5 object-contain" alt={t("nav.species")} />
              <span className="text-xs font-medium">{t("nav.species")}</span>
            </button>
          </Link>
          
          <Link href="/profile">
            <button className={cn(
              "flex flex-col items-center space-y-1 transition-colors",
              isActive("/profile") ? "text-cyan-400" : "text-gray-400 hover:text-cyan-400"
            )}>
              <User className="w-5 h-5" />
              <span className="text-xs font-medium">{t("nav.profile")}</span>
            </button>
          </Link>
        </div>
      </nav>

      <CatchLogModal 
        isOpen={showCatchModal} 
        onClose={() => setShowCatchModal(false)} 
      />
    </>
  );
}
