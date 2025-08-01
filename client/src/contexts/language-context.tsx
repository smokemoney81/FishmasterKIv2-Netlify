import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "de" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  de: {
    // Splash Page
    "splash.subtitle": "KÜNSTLICHE INTELLIGENZ",
    "splash.title": "FishMasterKI",
    "splash.startButton": "JETZT ANGELN STARTEN",
    
    // Navigation
    "nav.home": "Start",
    "nav.map": "Karte",
    "nav.log": "Fang",
    "nav.species": "Fangbuch",
    "nav.profile": "Profil",
    
    // Home Page
    "home.welcome": "Willkommen zurück, Angler!",
    "home.ready": "Bereit für Ihr nächstes Angelabenteuer?",
    "home.caughtFish": "Gefangene Fische",
    "home.foundSpecies": "Gefundene Arten",
    "home.visitedSpots": "Besuchte Plätze",
    "home.popularSpots": "Beliebte Angelplätze",
    "home.viewAll": "Alle anzeigen",
    "home.catches": "Fänge",
    "home.speciesGuide": "Fischarten-Guide",
    "home.browseAll": "Alle durchsuchen",
    "home.communityCatches": "Community Fänge",
    "home.seeMore": "Mehr anzeigen",
    "home.noCatches": "Noch keine Fänge protokolliert. Seien Sie der Erste!",
    
    // Quick Actions
    "quickActions.kiBuddy": "KI Buddy",
    "quickActions.map": "Karte",
    "quickActions.startFishing": "Start Fishing",
    "quickActions.weather": "Wetter",
    
    // Weather Widget
    "weather.todaysForecast": "Heutige Angelvorhersage",
    "weather.fishingConditions": "Angelbedingungen",
    
    // Species Page
    "species.title": "Fischarten-Guide",
    "species.search": "Nach Fischart suchen...",
    "species.difficulty.beginner": "Anfängerfreundlich",
    "species.difficulty.intermediate": "Mittel",
    "species.difficulty.expert": "Experte",
    
    // Map Page
    "map.title": "Angelplätze",
    "map.search": "Platz suchen...",
    "map.fishingScore": "Angel-Score",
    "map.recentCatches": "Letzte Fänge",
    "map.availableFish": "Verfügbare Fische",
    
    // Tips Page
    "tips.title": "Angel-Tipps & Tricks",
    "tips.search": "Nach Tipps suchen...",
    "tips.categories.all": "Alle",
    "tips.categories.techniques": "Techniken",
    "tips.categories.bait": "Köder",
    "tips.categories.equipment": "Ausrüstung",
    "tips.categories.seasonal": "Saisonal",
    
    // Profile Page
    "profile.title": "Mein Profil",
    "profile.statistics": "Statistiken",
    "profile.totalCatches": "Gesamt Fänge",
    "profile.biggestCatch": "Größter Fang",
    "profile.favoriteSpot": "Lieblingsplatz",
    "profile.achievements": "Erfolge",
    
    // Catch Modal
    "catch.logTitle": "Fang protokollieren",
    "catch.species": "Fischart",
    "catch.selectSpecies": "Art auswählen",
    "catch.location": "Ort",
    "catch.selectLocation": "Ort auswählen",
    "catch.weight": "Gewicht (kg)",
    "catch.length": "Länge (cm)",
    "catch.photo": "Foto hochladen",
    "catch.notes": "Notizen",
    "catch.cancel": "Abbrechen",
    "catch.save": "Speichern",
    
    // Identify Page
    "identify.title": "Fisch identifizieren",
    "identify.uploadPrompt": "Laden Sie ein Foto hoch, um den Fisch zu identifizieren",
    "identify.analyzing": "Analysiere Bild...",
    "identify.result": "Identifizierter Fisch",
    
    // Logbook Page
    "logbook.title": "FishMasterKI Fangbuch",
    "logbook.fishType": "Fischart (z.B. Hecht)",
    "logbook.weight": "Gewicht in kg (z.B. 3.4)",
    "logbook.spot": "Angelplatz",
    "logbook.gear": "Ausrüstung (Rute, Köder, Schnur...)",
    "logbook.save": "Fang speichern",
    "logbook.saveSuccess": "Fang gespeichert!",
    "logbook.saveSuccessDesc": "Dein Fang wurde erfolgreich im Fangbuch eingetragen.",
    "logbook.saveError": "Fehler beim Speichern",
    "logbook.saveErrorDesc": "Der Fang konnte nicht gespeichert werden. Bitte versuche es erneut.",
    "logbook.validationError": "Ungültige Eingabe",
    "logbook.validationErrorDesc": "Bitte fülle alle Felder korrekt aus!",
    "logbook.yourRanking": "Dein Ranking",
    "logbook.points": "Punkte",
    "logbook.rank": "Rang",
    "logbook.achievements": "Erfolge",
    "logbook.yourCatches": "Deine bisherigen Fänge",
    "logbook.spotLabel": "Spot",
    "logbook.gearLabel": "Gear",
    "logbook.noCatches": "Noch keine Fänge eingetragen",
  },
  en: {
    // Splash Page
    "splash.subtitle": "ARTIFICIAL INTELLIGENCE",
    "splash.title": "FishMasterKI",
    "splash.startButton": "START FISHING NOW",
    
    // Navigation
    "nav.home": "Home",
    "nav.map": "Map",
    "nav.log": "Log",
    "nav.species": "Species",
    "nav.profile": "Profile",
    
    // Home Page
    "home.welcome": "Welcome back, Angler!",
    "home.ready": "Ready for your next fishing adventure?",
    "home.caughtFish": "Caught Fish",
    "home.foundSpecies": "Found Species",
    "home.visitedSpots": "Visited Spots",
    "home.popularSpots": "Popular Fishing Spots",
    "home.viewAll": "View All",
    "home.catches": "Catches",
    "home.speciesGuide": "Species Guide",
    "home.browseAll": "Browse All",
    "home.communityCatches": "Community Catches",
    "home.seeMore": "See More",
    "home.noCatches": "No catches logged yet. Be the first to share your catch!",
    
    // Quick Actions
    "quickActions.kiBuddy": "AI Buddy",
    "quickActions.map": "Map",
    "quickActions.startFishing": "Start Fishing",
    "quickActions.weather": "Weather",
    
    // Weather Widget
    "weather.todaysForecast": "Today's Fishing Forecast",
    "weather.fishingConditions": "Fishing Conditions",
    
    // Species Page
    "species.title": "Fish Species Guide",
    "species.search": "Search fish species...",
    "species.difficulty.beginner": "Beginner Friendly",
    "species.difficulty.intermediate": "Intermediate",
    "species.difficulty.expert": "Expert",
    
    // Map Page
    "map.title": "Fishing Spots",
    "map.search": "Search location...",
    "map.fishingScore": "Fishing Score",
    "map.recentCatches": "Recent Catches",
    "map.availableFish": "Available Fish",
    
    // Tips Page
    "tips.title": "Fishing Tips & Tricks",
    "tips.search": "Search tips...",
    "tips.categories.all": "All",
    "tips.categories.techniques": "Techniques",
    "tips.categories.bait": "Bait",
    "tips.categories.equipment": "Equipment",
    "tips.categories.seasonal": "Seasonal",
    
    // Profile Page
    "profile.title": "My Profile",
    "profile.statistics": "Statistics",
    "profile.totalCatches": "Total Catches",
    "profile.biggestCatch": "Biggest Catch",
    "profile.favoriteSpot": "Favorite Spot",
    "profile.achievements": "Achievements",
    
    // Catch Modal
    "catch.logTitle": "Log Your Catch",
    "catch.species": "Fish Species",
    "catch.selectSpecies": "Select species",
    "catch.location": "Location",
    "catch.selectLocation": "Select location",
    "catch.weight": "Weight (lbs)",
    "catch.length": "Length (in)",
    "catch.photo": "Upload Photo",
    "catch.notes": "Notes",
    "catch.cancel": "Cancel",
    "catch.save": "Save",
    
    // Identify Page
    "identify.title": "Identify Fish",
    "identify.uploadPrompt": "Upload a photo to identify the fish",
    "identify.analyzing": "Analyzing image...",
    "identify.result": "Identified Fish",
    
    // Logbook Page
    "logbook.title": "FishMasterKI Logbook",
    "logbook.fishType": "Fish Type (e.g. Pike)",
    "logbook.weight": "Weight in kg (e.g. 3.4)",
    "logbook.spot": "Fishing Spot",
    "logbook.gear": "Gear (Rod, Bait, Line...)",
    "logbook.save": "Save Catch",
    "logbook.saveSuccess": "Catch Saved!",
    "logbook.saveSuccessDesc": "Your catch has been successfully recorded in the logbook.",
    "logbook.saveError": "Save Error",
    "logbook.saveErrorDesc": "Could not save the catch. Please try again.",
    "logbook.validationError": "Invalid Input",
    "logbook.validationErrorDesc": "Please fill in all fields correctly!",
    "logbook.yourRanking": "Your Ranking",
    "logbook.points": "Points",
    "logbook.rank": "Rank",
    "logbook.achievements": "Achievements",
    "logbook.yourCatches": "Your Previous Catches",
    "logbook.spotLabel": "Spot",
    "logbook.gearLabel": "Gear",
    "logbook.noCatches": "No catches recorded yet",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "de";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations["de"]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}