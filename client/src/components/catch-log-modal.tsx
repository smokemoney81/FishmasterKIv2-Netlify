import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Camera, X } from "lucide-react";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { FishSpecies, FishingSpot, InsertCatch } from "@shared/schema";
import type { UploadResult } from "@uppy/core";

interface CatchLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CatchLogModal({ isOpen, onClose }: CatchLogModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    speciesId: "",
    spotId: "",
    weight: "",
    length: "",
    notes: "",
    baitUsed: "",
    photoUrl: "",
  });

  const { data: species = [] } = useQuery<FishSpecies[]>({
    queryKey: ["/api/species"],
  });

  const { data: spots = [] } = useQuery<FishingSpot[]>({
    queryKey: ["/api/spots"],
  });

  const createCatchMutation = useMutation({
    mutationFn: async (catchData: InsertCatch) => {
      const response = await apiRequest("POST", "/api/catches", catchData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/catches"] });
      toast({
        title: "Success!",
        description: "Your catch has been logged successfully.",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to log your catch. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.speciesId) {
      toast({
        title: "Missing Information",
        description: "Please select a fish species.",
        variant: "destructive",
      });
      return;
    }

    const catchData: InsertCatch = {
      userId: "default-user", // In a real app, this would come from auth
      speciesId: formData.speciesId || undefined,
      spotId: formData.spotId || undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      length: formData.length ? parseFloat(formData.length) : undefined,
      notes: formData.notes || undefined,
      baitUsed: formData.baitUsed || undefined,
      photoUrl: formData.photoUrl || undefined,
      isReleased: false,
    };

    createCatchMutation.mutate(catchData);
  };

  const handleClose = () => {
    setFormData({
      speciesId: "",
      spotId: "",
      weight: "",
      length: "",
      notes: "",
      baitUsed: "",
      photoUrl: "",
    });
    onClose();
  };

  const getUploadParameters = async () => {
    const response = await apiRequest("POST", "/api/objects/upload", {});
    const data = await response.json();
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedFile = result.successful[0];
      const photoUrl = uploadedFile.uploadURL;
      setFormData(prev => ({ ...prev, photoUrl }));
      toast({
        title: "Photo uploaded!",
        description: "Your catch photo has been uploaded successfully.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto bg-gray-900/95 backdrop-blur-md border border-cyan-500/30">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-gray-100">
            Log Your Catch
            <Button variant="ghost" size="sm" onClick={handleClose} className="text-gray-300 hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="species" className="text-gray-200">Species *</Label>
            <Select value={formData.speciesId} onValueChange={(value) => setFormData(prev => ({ ...prev, speciesId: value }))}>
              <SelectTrigger className="bg-gray-800/60 border-cyan-500/30 text-white">
                <SelectValue placeholder="Select fish species..." className="placeholder:text-gray-400" />
              </SelectTrigger>
              <SelectContent>
                {species.map((fish) => (
                  <SelectItem key={fish.id} value={fish.id}>
                    {fish.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight" className="text-gray-200">Weight (lbs)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="0.0"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                className="bg-gray-800/60 border-cyan-500/30 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="length" className="text-gray-200">Length (in)</Label>
              <Input
                id="length"
                type="number"
                step="0.1"
                placeholder="0.0"
                value={formData.length}
                onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value }))}
                className="bg-gray-800/60 border-cyan-500/30 text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="spot" className="text-gray-200">Location</Label>
            <Select value={formData.spotId} onValueChange={(value) => setFormData(prev => ({ ...prev, spotId: value }))}>
              <SelectTrigger className="bg-gray-800/60 border-cyan-500/30 text-white">
                <SelectValue placeholder="Select fishing location..." className="placeholder:text-gray-400" />
              </SelectTrigger>
              <SelectContent>
                {spots.map((spot) => (
                  <SelectItem key={spot.id} value={spot.id}>
                    {spot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="bait" className="text-gray-200">Bait Used</Label>
            <Input
              id="bait"
              placeholder="What bait did you use?"
              value={formData.baitUsed}
              onChange={(e) => setFormData(prev => ({ ...prev, baitUsed: e.target.value }))}
              className="bg-gray-800/60 border-cyan-500/30 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <Label className="text-gray-200">Photo</Label>
            {formData.photoUrl ? (
              <div className="relative">
                <img 
                  src={formData.photoUrl} 
                  alt="Catch photo" 
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setFormData(prev => ({ ...prev, photoUrl: "" }))}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <ObjectUploader
                maxNumberOfFiles={1}
                maxFileSize={10485760}
                onGetUploadParameters={getUploadParameters}
                onComplete={handleUploadComplete}
                buttonClassName="w-full border-2 border-dashed border-cyan-500/30 rounded-lg p-6 text-center hover:border-cyan-400 transition-colors bg-gray-800/30"
              >
                <div>
                  <Camera className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-300">Add a photo of your catch</div>
                </div>
              </ObjectUploader>
            )}
          </div>

          <div>
            <Label htmlFor="notes" className="text-gray-200">Notes</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="Share details about your catch..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="bg-gray-800/60 border-cyan-500/30 text-white placeholder-gray-400"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
            disabled={createCatchMutation.isPending}
          >
            {createCatchMutation.isPending ? "Logging..." : "Log Catch"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
