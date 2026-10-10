import { createContext, useContext, useState } from 'react';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState({
    brandName: '',
    industry: '',
    audience: '',
    platforms: [],
    goals: '',
    competitors: '',
  });
  const [onboarded, setOnboarded] = useState(false);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, onboarded, setOnboarded }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
