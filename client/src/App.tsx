import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Map from "@/pages/map";
import Identify from "@/pages/identify";
import Species from "@/pages/species";
import Tips from "@/pages/tips";
import Profile from "@/pages/profile";
import BottomNavigation from "@/components/layout/bottom-navigation";

function Router() {
  return (
    <div className="min-h-screen bg-gray-900" style={{backgroundImage: 'url(/icons/background.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/map" component={Map} />
        <Route path="/identify" component={Identify} />
        <Route path="/species" component={Species} />
        <Route path="/tips" component={Tips} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
      <BottomNavigation />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
