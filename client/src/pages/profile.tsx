import MobileHeader from "@/components/layout/mobile-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Settings, Trophy, Calendar, Camera, MapPin } from "lucide-react";

export default function Profile() {
  return (
    <>
      <MobileHeader title="Profile" />
      
      {/* Profile Header */}
      <section className="px-4 py-6 bg-gradient-to-r from-blue-500 to-cyan-600">
        <div className="text-center text-white">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-1">Angler</h2>
          <p className="text-blue-100 mb-4">Fishing enthusiast since 2024</p>
          <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            <Settings className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="px-4 py-6">
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-slate-800">47</div>
            <div className="text-xs text-slate-500">Total Catches</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-slate-800">12</div>
            <div className="text-xs text-slate-500">Species Found</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-slate-800">8</div>
            <div className="text-xs text-slate-500">Spots Visited</div>
          </Card>
        </div>
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

      {/* Spacer for bottom navigation */}
      <div className="h-20"></div>
    </>
  );
}
