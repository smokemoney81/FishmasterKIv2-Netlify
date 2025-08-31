import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import MobileHeader from "@/components/layout/mobile-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, Settings, Trophy, Calendar, Camera, MapPin, Edit, Save, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Max Mustermann",
    bio: "Leidenschaftlicher Angler seit 15 Jahren. Spezialisiert auf Raubfisch-Angeln.",
    location: "Bayern, Deutschland",
    favoriteSpot: "Chiemsee",
    avatar: ""
  });
  const [tempProfileData, setTempProfileData] = useState(profileData);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Hole echte User-Statistiken
  const { data: userStats = { totalPoints: 0, totalCatches: 0, rank: "Anfänger", achievements: [] } } = useQuery({
    queryKey: ["/api/logbook/stats", "default-user"],
    queryFn: async () => {
      const response = await fetch("/api/logbook/stats/default-user");
      return response.json();
    }
  });

  // Hole Fang-Daten für weitere Statistiken
  const { data: catches = [] } = useQuery({
    queryKey: ["/api/catches"],
    queryFn: async () => {
      const response = await fetch("/api/catches?userId=default-user");
      return response.json();
    }
  });

  // Berechne zusätzliche Statistiken
  const uniqueSpecies = new Set(catches.map((c: any) => c.speciesId)).size;
  const totalWeight = catches.reduce((sum: number, c: any) => sum + (c.weight || 0), 0);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setTempProfileData(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    setProfileData(tempProfileData);
    setShowEditProfile(false);
    toast({
      title: "Profil gespeichert!",
      description: "Ihre Änderungen wurden erfolgreich gespeichert."
    });
  };

  return (
    <>
      <MobileHeader title="Profil" />
      
      {/* Profile Header */}
      <section className="px-4 py-6 bg-gradient-to-r from-blue-500 to-cyan-600">
        <div className="text-center text-white">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-1">{profileData.name}</h2>
          <p className="text-blue-100 mb-4">{profileData.bio}</p>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => {
                setTempProfileData(profileData);
                setShowEditProfile(true);
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Profil bearbeiten
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Einstellungen
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="px-4 py-6">
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center bg-gray-900/30 border-cyan-500/20">
            <div className="text-2xl font-bold text-cyan-300">{userStats.totalCatches}</div>
            <div className="text-xs text-gray-400">Gesamte Fänge</div>
          </Card>
          <Card className="p-4 text-center bg-gray-900/30 border-cyan-500/20">
            <div className="text-2xl font-bold text-cyan-300">{uniqueSpecies}</div>
            <div className="text-xs text-gray-400">Arten entdeckt</div>
          </Card>
          <Card className="p-4 text-center bg-gray-900/30 border-cyan-500/20">
            <div className="text-2xl font-bold text-cyan-300">{totalWeight.toFixed(1)}kg</div>
            <div className="text-xs text-gray-400">Gesamtgewicht</div>
          </Card>
        </div>
        
        <Card className="mt-4 p-4 bg-gray-900/30 border-cyan-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-100">Aktueller Rang</h4>
              <p className="text-2xl font-bold text-cyan-300">{userStats.rank}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Punkte</p>
              <p className="text-xl font-bold text-cyan-300">{userStats.totalPoints}</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Achievements */}
      <section className="px-4 py-2">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Achievements</h3>
        <div className="space-y-3">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-800">First Catch</h4>
                <p className="text-sm text-slate-600">Logged your first fishing catch</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Earned</Badge>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-800">Photographer</h4>
                <p className="text-sm text-slate-600">Shared 10 catch photos</p>
              </div>
              <Badge variant="outline">In Progress</Badge>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-800">Explorer</h4>
                <p className="text-sm text-slate-600">Visit 10 different fishing spots</p>
              </div>
              <Badge variant="outline">8/10</Badge>
            </div>
          </Card>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="px-4 py-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <Card className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-slate-800">Visited <span className="font-medium">Crystal Lake</span></p>
                <p className="text-xs text-slate-500">2 hours ago</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-slate-800">Logged a <span className="font-medium">Rainbow Trout</span> catch</p>
                <p className="text-xs text-slate-500">1 day ago</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-slate-800">Read tip: <span className="font-medium">Early Morning Fishing</span></p>
                <p className="text-xs text-slate-500">3 days ago</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Settings */}
      <section className="px-4 py-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Settings</h3>
        <div className="space-y-2">
          <Card className="p-4 hover:bg-slate-50 cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-slate-800">Notifications</span>
              <span className="text-slate-400">→</span>
            </div>
          </Card>
          
          <Card className="p-4 hover:bg-slate-50 cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-slate-800">Privacy</span>
              <span className="text-slate-400">→</span>
            </div>
          </Card>
          
          <Card className="p-4 hover:bg-slate-50 cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-slate-800">Data Export</span>
              <span className="text-slate-400">→</span>
            </div>
          </Card>
          
          <Card className="p-4 hover:bg-slate-50 cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-slate-800">About</span>
              <span className="text-slate-400">→</span>
            </div>
          </Card>
        </div>
      </section>

      {/* Edit Profile Modal */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent className="max-w-md bg-gray-900 border-cyan-500/20">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-100">Profil bearbeiten</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center overflow-hidden">
                  {tempProfileData.avatar ? (
                    <img src={tempProfileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-cyan-400" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <Input
                value={tempProfileData.name}
                onChange={(e) => setTempProfileData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gray-800/60 border-cyan-500/30 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Beschreibung</label>
              <Textarea
                value={tempProfileData.bio}
                onChange={(e) => setTempProfileData(prev => ({ ...prev, bio: e.target.value }))}
                className="bg-gray-800/60 border-cyan-500/30 text-white"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Standort</label>
              <Input
                value={tempProfileData.location}
                onChange={(e) => setTempProfileData(prev => ({ ...prev, location: e.target.value }))}
                className="bg-gray-800/60 border-cyan-500/30 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Lieblings-Angelplatz</label>
              <Input
                value={tempProfileData.favoriteSpot}
                onChange={(e) => setTempProfileData(prev => ({ ...prev, favoriteSpot: e.target.value }))}
                className="bg-gray-800/60 border-cyan-500/30 text-white"
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                onClick={() => setShowEditProfile(false)}
              >
                Abbrechen
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                onClick={saveProfile}
              >
                <Save className="w-4 h-4 mr-2" />
                Speichern
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md bg-gray-900 border-cyan-500/20">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-100">Einstellungen</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card className="p-4 bg-gray-800/60">
              <h4 className="font-medium text-gray-100 mb-2">App-Einstellungen</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Benachrichtigungen</span>
                  <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-300">
                    Ein
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Standort verwenden</span>
                  <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-300">
                    Ein
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Automatische Uploads</span>
                  <Button variant="outline" size="sm" className="border-gray-500/30 text-gray-400">
                    Aus
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gray-800/60">
              <h4 className="font-medium text-gray-100 mb-2">Datenschutz</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Profil öffentlich</span>
                  <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-300">
                    Ein
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Fänge teilen</span>
                  <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-300">
                    Ein
                  </Button>
                </div>
              </div>
            </Card>

            <Button 
              variant="outline" 
              className="w-full border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
              onClick={() => {
                setShowSettings(false);
                toast({
                  title: "Einstellungen gespeichert!",
                  description: "Ihre Einstellungen wurden aktualisiert."
                });
              }}
            >
              Einstellungen speichern
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Spacer for bottom navigation */}
      <div className="h-20"></div>
    </>
  );
}
