'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, TrainingCenterProfile, TrainingCenterType } from '../types';
import { MOCK_TRAINING_CENTER } from '../mock-data';

export interface UserSession {
  role: Role;
  id: string;
  name: string;
  token: string;
  trainingCenterProfile?: TrainingCenterProfile;
  training_center_type?: TrainingCenterType;
}

export interface TrainingCenterRegData {
  fullName: string;
  vid: string;
  phone?: string;
  trainingCenterType: TrainingCenterType;
  skillTrade?: string;
  tcId?: string;
  stateDistrict?: string;
}

export interface EmployerRegData {
  companyName: string;
  employerType?: string;
  registrationNumber?: string;
  contactEmail?: string;
  location?: string;
}

export interface OfficerRegData {
  officerName: string;
  designation?: string;
  officerId: string;
  jurisdiction?: string;
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  loginAsRole: (role: Role, credentials?: { vid?: string; name?: string; trainingCenterType?: TrainingCenterType }) => Promise<boolean>;
  registerAsRole: (role: Role, data: TrainingCenterRegData | EmployerRegData | OfficerRegData) => Promise<boolean>;
  giveConsent: () => void;
  logout: () => void;
  updateTrustTier: (tier: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check localStorage for saved session
    const saved = localStorage.getItem('livelihood_user_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration check if old session had role 'trainee'
        if (parsed.role === 'trainee') {
          parsed.role = 'training-center';
          parsed.training_center_type = parsed.trainee_type || 'formal';
          parsed.trainingCenterProfile = parsed.traineeProfile;
        }
        setUser(parsed);
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const loginAsRole = async (
    role: Role,
    credentials?: { vid?: string; name?: string; trainingCenterType?: TrainingCenterType }
  ): Promise<boolean> => {
    let session: UserSession;

    if (role === 'training-center') {
      const cleanVid = credentials?.vid ? credentials.vid.replace(/\D/g, '') : '982344128801';
      const tcType: TrainingCenterType = credentials?.trainingCenterType || 'formal';
      session = {
        role: 'training-center',
        id: tcType === 'formal' ? 'TC-884920' : 'TC-664210',
        name: credentials?.name || (tcType === 'formal' ? MOCK_TRAINING_CENTER.full_name : 'Vikram Singh'),
        token: `mock-jwt-token-training-center-${Date.now()}`,
        training_center_type: tcType,
        trainingCenterProfile: {
          ...MOCK_TRAINING_CENTER,
          full_name: credentials?.name || (tcType === 'formal' ? MOCK_TRAINING_CENTER.full_name : 'Vikram Singh'),
          training_center_id: tcType === 'formal' ? 'TC-884920' : 'TC-664210',
          vid: cleanVid,
          consent_given: true,
          training_center_type: tcType
        }
      };
    } else if (role === 'employer') {
      session = {
        role: 'employer',
        id: 'EMP-40192',
        name: credentials?.name || 'Apex Micro-Electronics Ltd',
        token: `mock-jwt-token-employer-${Date.now()}`
      };
    } else {
      // officer
      session = {
        role: 'officer',
        id: 'OFF-77201',
        name: credentials?.name || 'District Officer Kulkarni (Pune)',
        token: `mock-jwt-token-officer-${Date.now()}`
      };
    }

    setUser(session);
    localStorage.setItem('livelihood_user_session', JSON.stringify(session));
    return true;
  };

  const registerAsRole = async (
    role: Role,
    data: TrainingCenterRegData | EmployerRegData | OfficerRegData
  ): Promise<boolean> => {
    let session: UserSession;

    if (role === 'training-center') {
      const tcData = data as TrainingCenterRegData;
      const cleanVid = tcData.vid ? tcData.vid.replace(/\D/g, '') : '982344128801';
      const tcId = `TC-${Math.floor(100000 + Math.random() * 900000)}`;
      session = {
        role: 'training-center',
        id: tcId,
        name: tcData.fullName,
        token: `mock-jwt-token-tc-reg-${Date.now()}`,
        training_center_type: tcData.trainingCenterType,
        trainingCenterProfile: {
          ...MOCK_TRAINING_CENTER,
          full_name: tcData.fullName,
          training_center_id: tcId,
          vid: cleanVid,
          consent_given: true,
          training_center_type: tcData.trainingCenterType,
          sector: tcData.skillTrade || MOCK_TRAINING_CENTER.sector,
          training_center: tcData.tcId || MOCK_TRAINING_CENTER.training_center,
          district: tcData.stateDistrict || MOCK_TRAINING_CENTER.district,
          phone: tcData.phone || MOCK_TRAINING_CENTER.phone
        }
      };
    } else if (role === 'employer') {
      const eData = data as EmployerRegData;
      const empId = eData.registrationNumber || `EMP-${Math.floor(10000 + Math.random() * 90000)}`;
      session = {
        role: 'employer',
        id: empId,
        name: eData.companyName,
        token: `mock-jwt-token-employer-reg-${Date.now()}`
      };
    } else {
      const oData = data as OfficerRegData;
      const offId = oData.officerId || `OFF-${Math.floor(10000 + Math.random() * 90000)}`;
      session = {
        role: 'officer',
        id: offId,
        name: `${oData.officerName} (${oData.jurisdiction || 'District Nodal Officer'})`,
        token: `mock-jwt-token-officer-reg-${Date.now()}`
      };
    }

    setUser(session);
    localStorage.setItem('livelihood_user_session', JSON.stringify(session));
    return true;
  };

  const giveConsent = () => {
    if (user && user.trainingCenterProfile) {
      const updatedProfile = { ...user.trainingCenterProfile, consent_given: true };
      const updatedUser = { ...user, trainingCenterProfile: updatedProfile };
      setUser(updatedUser);
      localStorage.setItem('livelihood_user_session', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('livelihood_user_session');
  };

  const updateTrustTier = (tier: number) => {
    if (user && user.trainingCenterProfile) {
      const updatedProfile = { ...user.trainingCenterProfile, trust_tier: tier };
      const updatedUser = { ...user, trainingCenterProfile: updatedProfile };
      setUser(updatedUser);
      localStorage.setItem('livelihood_user_session', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginAsRole,
        registerAsRole,
        giveConsent,
        logout,
        updateTrustTier
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
