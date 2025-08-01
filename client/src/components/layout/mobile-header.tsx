import { Search, Bell, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
}

export default function MobileHeader({ title, showBack = false }: MobileHeaderProps) {
  const [, setLocation] = useLocation();

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          {showBack ? (
            <Button variant="ghost" size="sm" onClick={() => setLocation("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">🐟</span>
            </div>
          )}
          <h1 className="text-xl font-bold text-slate-800">
            {title || "FishMasterKI"}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-500 transition-colors">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-500 transition-colors">
            <Bell className="w-5 h-5" />
          </Button>
          <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
