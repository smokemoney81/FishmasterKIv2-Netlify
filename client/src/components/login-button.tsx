
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth, loginWithReplit } from "@/hooks/use-auth";
import { LogIn, User } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function LoginButton() {
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <User className="h-4 w-4" />
      </Button>
    );
  }

  if (user.isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.profileImage} alt={user.name} />
          <AvatarFallback>
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-white hidden sm:inline">
          {user.name}
        </span>
      </div>
    );
  }

  return (
    <Button 
      onClick={loginWithReplit}
      variant="outline" 
      size="sm"
      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
    >
      <LogIn className="h-4 w-4 mr-2" />
      {t('login')}
    </Button>
  );
}
