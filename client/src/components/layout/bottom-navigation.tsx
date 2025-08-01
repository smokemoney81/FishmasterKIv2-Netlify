import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, Map, Plus, Fish, User } from "lucide-react";
import { useState } from "react";
import CatchLogModal from "@/components/catch-log-modal";

export default function BottomNavigation() {
  const [location] = useLocation();
  const [showCatchModal, setShowCatchModal] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 z-40">
        <div className="flex items-center justify-around">
          <Link href="/">
            <button className={cn(
              "flex flex-col items-center space-y-1 transition-colors",
              isActive("/") ? "text-blue-500" : "text-slate-500 hover:text-blue-500"
            )}>
              <Home className="w-5 h-5" />
              <span className="text-xs font-medium">Home</span>
            </button>
          </Link>
          
          <Link href="/map">
            <button className={cn(
              "flex flex-col items-center space-y-1 transition-colors",
              isActive("/map") ? "text-blue-500" : "text-slate-500 hover:text-blue-500"
            )}>
              <Map className="w-5 h-5" />
              <span className="text-xs font-medium">Map</span>
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
              isActive("/species") ? "text-blue-500" : "text-slate-500 hover:text-blue-500"
            )}>
              <Fish className="w-5 h-5" />
              <span className="text-xs font-medium">Species</span>
            </button>
          </Link>
          
          <Link href="/profile">
            <button className={cn(
              "flex flex-col items-center space-y-1 transition-colors",
              isActive("/profile") ? "text-blue-500" : "text-slate-500 hover:text-blue-500"
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
