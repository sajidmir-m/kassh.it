import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      // Redirect to the new MyProfile page
      navigate('/profile/my-profile');
    }
  }, [user, navigate]);

  return null;
};

export default Profile;