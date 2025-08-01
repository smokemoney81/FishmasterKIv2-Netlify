import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/language-context";
import NotFound from "@/pages/not-found";
import Splash from "@/pages/splash";
import Home from "@/pages/home";
import Map from "@/pages/map";
import Identify from "@/pages/identify";
import Species from "@/pages/species";
import Tips from "@/pages/tips";
import Profile from "@/pages/profile";
import Logbook from "@/pages/logbook";
import BottomNavigation from "@/components/layout/bottom-navigation";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Splash} />
      <Route path="/home">
        <div className="min-h-screen bg-gray-900" style={{backgroundImage: 'url(/icons/background.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
          <Home />
          <BottomNavigation />
        </div>
      </Route>
      <Route path="/map">
        <div className="min-h-screen bg-gray-900" style={{backgroundImage: 'url(/icons/background.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
          <Map />
          <BottomNavigation />
        </div>
      </Route>
      <Route path="/identify">
        <div className="min-h-screen bg-gray-900" style={{backgroundImage: 'url(/icons/background.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
          <Identify />
          <BottomNavigation />
        </div>
      </Route>
      <Route path="/species">
        <div className="min-h-screen bg-gray-900" style={{backgroundImage: 'url(/icons/background.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
          <Species />
          <BottomNavigation />
        </div>
      </Route>
      <Route path="/logbook">
        <div className="min-h-screen bg-gray-900" style={{backgroundImage: 'url(/icons/background.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
          <Logbook />
          <BottomNavigation />
        </div>
      </Route>
      <Route path="/tips">
        <div className="min-h-screen bg-gray-900" style={{backgroundImage: 'url(/icons/background.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
          <Tips />
          <BottomNavigation />
        </div>
      </Route>
      <Route path="/profile">
        <div className="min-h-screen bg-gray-900" style={{backgroundImage: 'url(/icons/background.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
          <Profile />
          <BottomNavigation />
        </div>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
