import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera, Upload, MapPin, Check, Loader, Trash2, Droplet, LampFloor, AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ReportCategory } from '@/types';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { db } from '@/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

export function ReportForm() {
  const [category, setCategory] = useState<ReportCategory>('Waste');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  const [address, setAddress] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCategoryChange = (value: string) => setCategory(value as ReportCategory);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handlePhotoClick = () => {
    photoInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'urban_unsigned'); // Replace with your preset

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/djkrzogrq/image/upload', // Replace with your cloud
        formData
      );
      setPhotoUrl(res.data.secure_url);
      toast({
        title: 'Image uploaded',
        description: 'Image successfully uploaded to Cloudinary.',
      });
    } catch (err) {
      console.error('Image upload failed:', err);
      toast({
        title: 'Upload error',
        description: 'Failed to upload image.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      return data.display_name || 'Address not found';
    } catch (err) {
      console.error('Reverse geocoding failed:', err);
      return 'Address not found';
    }
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });

          const resolvedAddress = await reverseGeocode(latitude, longitude);
          setAddress(resolvedAddress);

          setIsGettingLocation(false);
          toast({
            title: 'Location detected',
            description: 'Your location has been added.',
          });
        },
        () => {
          setIsGettingLocation(false);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Location access denied.',
          });
        }
      );
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    if (e.target.value.trim() !== '') {
      setLocation({ lat: 0, lng: 0 });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!address || !photoUrl || !location.lat || !location.lng) {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please upload a photo and provide the location and address.',
      });
      setIsSubmitting(false);
      return;
    }

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      toast({
        variant: 'destructive',
        title: 'Authentication error',
        description: 'You must be logged in to submit a report.',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(db, 'reports'), {
        userId: currentUser.uid,
        category,
        description,
        photoUrl,
        location: {
          lat: location.lat,
          lng: location.lng,
          address,
        },
        address,
        timestamp: serverTimestamp(), // renamed to match ReportCard
      });

      toast({
        title: 'Report submitted',
        description: 'Your report has been successfully submitted.',
      });

      navigate('/reports');
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        variant: 'destructive',
        title: 'Submission failed',
        description: 'Could not submit your report.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Report an Issue</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Issue Category</Label>
            <RadioGroup
              id="category"
              value={category}
              onValueChange={handleCategoryChange}
              className="grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              {[
                { value: 'Waste', icon: <Trash2 />, label: 'Waste' },
                { value: 'Pothole', icon: <AlertCircle />, label: 'Pothole' },
                { value: 'Leak', icon: <Droplet />, label: 'Leak' },
                { value: 'Streetlight', icon: <LampFloor />, label: 'Streetlight' },
              ].map(item => (
                <div key={item.value}>
                  <RadioGroupItem value={item.value} id={item.value} className="peer sr-only" />
                  <Label
                    htmlFor={item.value}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-muted/50 p-4 hover:bg-muted/80 peer-data-[state=checked]:border-urban-primary"
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Photo */}
          <div className="space-y-2">
            <Label>Photo</Label>
            <div className="flex items-center gap-4">
              <div
                onClick={handlePhotoClick}
                className={`w-full h-40 bg-muted/60 rounded-md flex flex-col items-center justify-center cursor-pointer border-2 border-dashed transition-all ${photoUrl ? 'border-transparent' : 'border-muted-foreground/20 hover:border-muted-foreground/30'}`}
              >
                <input
                  type="file"
                  ref={photoInputRef}
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="sr-only"
                />
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader className="h-8 w-8 animate-spin" />
                    <span className="text-sm">Uploading...</span>
                  </div>
                ) : photoUrl ? (
                  <img src={photoUrl} alt="Issue" className="w-full h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload className="h-8 w-8" />
                    <span className="text-sm font-medium">Upload photo</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="flex gap-2">
              <Input
                id="location"
                placeholder="Enter address or use current location"
                value={address}
                onChange={handleAddressChange}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
              >
                {isGettingLocation ? <Loader className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              {location.lat && location.lng
                ? `Coordinates: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
                : 'Please enter address or use current location'}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Provide additional details..."
              rows={4}
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Submit Report
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
