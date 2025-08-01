import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Plus, User } from "lucide-react";
import { useState } from "react";
import CatchLogModal from "@/components/catch-log-modal";
const homeIcon = "/icons/file_00000000f6186246a8136bebf875e096_1754053799824.png";
const mapIcon = "/icons/icon_4_1754053799779.png";
const fangbuchIcon = "/icons/icon_2_1754053799796.png";

export default function BottomNavigation() {
  const [location] = useLocation();
  const [showCatchModal, setShowCatchModal] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-sm border-t border-cyan-500/30 px-4 py-2 z-40">
        <div className="flex items-center justify-around">
          <Link href="/home">
            <button className={cn(
              "flex flex-col items-center space-y-1 transition-colors",
              isActive("/home") ? "text-cyan-400" : "text-gray-400 hover:text-cyan-400"
            )}>
              <img src={homeIcon} className="w-5 h-5 object-contain" alt="Home" />
              <span className="text-xs font-medium">Home</span>
            </button>
          </Link>
          
          <Link href="/map">
            <button className={cn(
              "flex flex-col items-center space-y-1 transition-colors",
              isActive("/map") ? "text-cyan-400" : "text-gray-400 hover:text-cyan-400"
            )}>
              <img src={mapIcon} className="w-5 h-5 object-contain" alt="Karte" />
              <span className="text-xs font-medium">Karte</span>
            </button>
          </Link>
          
          <button 
            className="flex flex-col items-center space-y-1 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-xl px-4 py-2"
            onClick={() => setShowCatchModal(true)}
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs font-medium">Log</span>
          </button>
          
          <Link href="/species">
            <button className={cn(
              "flex flex-col items-center space-y-1 transition-colors",
              isActive("/species") ? "text-cyan-400" : "text-gray-400 hover:text-cyan-400"
            )}>
              <img src={fangbuchIcon} className="w-5 h-5 object-contain" alt="Fangbuch" />
              <span className="text-xs font-medium">Fangbuch</span>
            </button>
          </Link>
          
          <Link href="/profile">
            <button className={cn(
              "flex flex-col items-center space-y-1 transition-colors",
              isActive("/profile") ? "text-cyan-400" : "text-gray-400 hover:text-cyan-400"
            )}>
              <User className="w-5 h-5" />
              <span className="text-xs font-medium">Profile</span>
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
