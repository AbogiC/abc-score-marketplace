import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { User, Mail, Camera, Save, Music, BookOpen, Star } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    avatarUrl: '',
    role: 'user'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    sheetsUploaded: 0,
    coursesCompleted: 0,
    totalRating: 0
  });

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.displayName || user.fullName || '',
        email: user.email || '',
        avatarUrl: user.photoURL || '',
        role: user.role || 'user'
      });
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    // Mock stats for demo
    setStats({
      sheetsUploaded: 3,
      coursesCompleted: 1,
      totalRating: 4.5
    });
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: profile.fullName,
          avatar_url: profile.avatarUrl
        })
      });

      if (response.ok) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !user?.uid) return;

    setLoading(true);
    try {
      const token = await user.getIdToken();
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${BACKEND_URL}/api/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(prev => ({ ...prev, avatarUrl: data.image_url }));
        toast.success('Avatar uploaded successfully!');
      } else {
        throw new Error('Failed to upload avatar');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-text font-crimson">Profile</h1>
        <p className="text-xl text-slate-600">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and preferences</CardDescription>
              </div>
              <Button
                variant={isEditing ? "destructive" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xl">
                      {profile.fullName.charAt(0) || profile.email.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <label className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors">
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{profile.fullName}</h3>
                  <p className="text-slate-600">{profile.email}</p>
                  <p className="text-sm text-slate-500 capitalize">{profile.role} Member</p>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-slate-50' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="bg-slate-50"
                  />
                  <p className="text-xs text-slate-500">Email cannot be changed</p>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-4">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="btn-animated bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences and security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-slate-600">Receive updates about new sheet music and courses</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Privacy Settings</h4>
                  <p className="text-sm text-slate-600">Control who can see your profile and activity</p>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Change Password</h4>
                  <p className="text-sm text-slate-600">Update your account password</p>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats and Activity */}
        <div className="space-y-6">
          {/* Stats Card */}
          <Card className="glass bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="text-indigo-800">Your Activity</CardTitle>
              <CardDescription>Track your progress and contributions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Music className="w-5 h-5 text-indigo-600" />
                  <span className="font-medium">Sheets Uploaded</span>
                </div>
                <span className="text-xl font-bold text-indigo-700">{stats.sheetsUploaded}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Courses Completed</span>
                </div>
                <span className="text-xl font-bold text-purple-700">{stats.coursesCompleted}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium">Average Rating</span>
                </div>
                <span className="text-xl font-bold text-yellow-700">{stats.totalRating}/5</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span className="text-slate-600">Completed "Music Theory Fundamentals"</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-slate-600">Uploaded "Moonlight Sonata" sheet music</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-slate-600">Started "Basic Chord Theory" course</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full btn-animated bg-indigo-600 hover:bg-indigo-700">
                Upload Sheet Music
              </Button>
              <Button variant="outline" className="w-full">
                Browse Library
              </Button>
              <Button variant="outline" className="w-full">
                Continue Learning
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;