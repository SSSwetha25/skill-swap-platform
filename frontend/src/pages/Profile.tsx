
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Plus, X, Camera, Star, MapPin, Clock, User } from 'lucide-react';

const availabilityOptions = [
  { id: 'mornings', label: 'Mornings', icon: '🌅' },
  { id: 'evenings', label: 'Evenings', icon: '🌆' },
  { id: 'weekends', label: 'Weekends', icon: '🎉' }
];

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    profilePhoto: user?.profilePhoto || '',
    skillsOffered: user?.skillsOffered || [],
    skillsWanted: user?.skillsWanted || [],
    availability: user?.availability || [],
    isPublic: user?.isPublic ?? true
  });
  
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }

    updateProfile(formData);
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated",
    });
  };

  const handleDiscard = () => {
    setFormData({
      name: user?.name || '',
      location: user?.location || '',
      profilePhoto: user?.profilePhoto || '',
      skillsOffered: user?.skillsOffered || [],
      skillsWanted: user?.skillsWanted || [],
      availability: user?.availability || [],
      isPublic: user?.isPublic ?? true
    });
    setIsEditing(false);
  };

  const addSkillOffered = () => {
    if (newSkillOffered.trim() && !formData.skillsOffered.includes(newSkillOffered.trim())) {
      setFormData({
        ...formData,
        skillsOffered: [...formData.skillsOffered, newSkillOffered.trim()]
      });
      setNewSkillOffered('');
    }
  };

  const removeSkillOffered = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skillsOffered: formData.skillsOffered.filter(skill => skill !== skillToRemove)
    });
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim() && !formData.skillsWanted.includes(newSkillWanted.trim())) {
      setFormData({
        ...formData,
        skillsWanted: [...formData.skillsWanted, newSkillWanted.trim()]
      });
      setNewSkillWanted('');
    }
  };

  const removeSkillWanted = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skillsWanted: formData.skillsWanted.filter(skill => skill !== skillToRemove)
    });
  };

  const handleAvailabilityChange = (availabilityId: string, checked: boolean) => {
    setFormData({
      ...formData,
      availability: checked
        ? [...formData.availability, availabilityId]
        : formData.availability.filter(a => a !== availabilityId)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-purple-100">
            <User className="h-6 w-6 text-purple-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              My Profile
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your profile information and showcase your skills to connect with other learners
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleDiscard} 
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <X className="h-4 w-4 mr-2" />
                Discard
              </Button>
              <Button 
                onClick={handleSave} 
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
              >
                <Star className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg"
            >
              Edit Profile
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Photo Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2 text-purple-700">
                <Camera className="h-5 w-5" />
                Profile Photo
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="relative mx-auto w-32 h-32">
                <Avatar className="w-32 h-32 border-4 border-purple-200 shadow-lg">
                  <AvatarImage src={formData.profilePhoto} alt={formData.name} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-100 to-blue-100 text-purple-700">
                    {formData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg"
                    onClick={() => {
                      const url = prompt('Enter photo URL:');
                      if (url) {
                        setFormData({ ...formData, profilePhoto: url });
                      }
                    }}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {isEditing && (
                <div className="space-y-2">
                  <Label htmlFor="photoUrl" className="text-gray-700">Profile Photo URL</Label>
                  <Input
                    id="photoUrl"
                    value={formData.profilePhoto}
                    onChange={(e) => setFormData({ ...formData, profilePhoto: e.target.value })}
                    placeholder="https://example.com/photo.jpg"
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-700 font-medium">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1 border-purple-200 focus:border-purple-400 disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <Label htmlFor="location" className="text-gray-700 font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1 border-purple-200 focus:border-purple-400 disabled:bg-gray-50"
                    placeholder="City, State"
                  />
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                  <Switch
                    id="isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                    disabled={!isEditing}
                  />
                  <Label htmlFor="isPublic" className="text-gray-700 font-medium">Make profile public</Label>
                </div>
              </CardContent>
            </Card>

            {/* Skills Offered */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-green-700">Skills I Can Teach</CardTitle>
                <CardDescription>What skills can you share with others?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {formData.skillsOffered.map((skill, index) => (
                    <Badge key={index} className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 hover:bg-green-50">
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkillOffered(skill)}
                          className="ml-2 hover:text-red-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newSkillOffered}
                      onChange={(e) => setNewSkillOffered(e.target.value)}
                      placeholder="Add a skill you can teach"
                      onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
                      className="border-green-200 focus:border-green-400"
                    />
                    <Button onClick={addSkillOffered} size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills Wanted */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-blue-700">Skills I Want to Learn</CardTitle>
                <CardDescription>What skills are you looking to develop?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {formData.skillsWanted.map((skill, index) => (
                    <Badge key={index} className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 hover:bg-blue-50">
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkillWanted(skill)}
                          className="ml-2 hover:text-red-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newSkillWanted}
                      onChange={(e) => setNewSkillWanted(e.target.value)}
                      placeholder="Add a skill you want to learn"
                      onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
                      className="border-blue-200 focus:border-blue-400"
                    />
                    <Button onClick={addSkillWanted} size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Availability */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <Clock className="h-5 w-5" />
                  Availability
                </CardTitle>
                <CardDescription>When are you available for skill exchanges?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {availabilityOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-100 hover:border-orange-200 transition-colors">
                      <Checkbox
                        id={option.id}
                        checked={formData.availability.includes(option.id)}
                        onCheckedChange={(checked) => handleAvailabilityChange(option.id, !!checked)}
                        disabled={!isEditing}
                      />
                      <Label htmlFor={option.id} className="flex items-center gap-2 text-gray-700 cursor-pointer">
                        <span className="text-lg">{option.icon}</span>
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
