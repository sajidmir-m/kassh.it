import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Edit, Save, X, MapPin, Phone, Mail, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const MyProfile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: user?.email || ''
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error('Failed to update profile: ' + error.message);
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        email: user?.email || ''
      });
    }
  }, [profile, user?.email]);

  const handleSave = () => {
    updateProfile.mutate({
      full_name: formData.full_name,
      phone: formData.phone
    });
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your personal information and account settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle>Personal Information</CardTitle>
                        <p className="text-sm text-gray-600">Update your personal details</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-2"
                    >
                      {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Full Name</label>
                      {isEditing ? (
                        <Input
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-lg">{profile?.full_name || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Phone Number</label>
                      {isEditing ? (
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-lg">{profile?.phone || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Email Address</label>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-lg">{user?.email}</span>
                        <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded">Verified</span>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 pt-4 border-t">
                      <Button onClick={handleSave} disabled={updateProfile.isPending}>
                        <Save className="h-4 w-4 mr-2" />
                        {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </div>
                  )}

                  {(!profile?.full_name || !profile?.phone) && !isEditing && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Complete your profile:</strong> Please add your full name and phone number to ensure proper order processing and delivery.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/profile/orders')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    View Orders
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/profile/addresses')}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Manage Addresses
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/profile/policy')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Privacy Policy
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={signOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${profile?.is_verified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-sm font-medium">
                      {profile?.is_verified ? 'Verified Account' : 'Pending Verification'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {profile?.is_verified 
                      ? 'Your account is fully verified and ready to use.' 
                      : 'Complete your profile to get verified status.'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
