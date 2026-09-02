'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, TraineeProfile, TraineeType } from '../types';
import { MOCK_TRAINEE } from '../mock-data';

export interface UserSession {
  role: Role;
  id: string;
  name: string;
  token: string;
  traineeProfile?: TraineeProfile;
  trainee_type?: TraineeType;
}

export interface TraineeRegData {
  fullName: string;
  vid: string;
  phone?: string;
  traineeType: TraineeType;
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
  loginAsRole: (role: Role, credentials?: { vid?: string; name?: string; traineeType?: TraineeType }) => Promise<boolean>;
  registerAsRole: (role: Role, data: TraineeRegData | EmployerRegData | OfficerRegData) => Promise<boolean>;
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
        setUser(JSON.parse(saved));
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
    credentials?: { vid?: string; name?: string; traineeType?: TraineeType }
  ): Promise<boolean> => {
    let session: UserSession;

    if (role === 'trainee') {
      const cleanVid = credentials?.vid ? credentials.vid.replace(/\D/g, '') : '982344128801';
      const tType: TraineeType = credentials?.traineeType || 'formal';
      session = {
        role: 'trainee',
        id: tType === 'formal' ? 'TR-884920' : 'TR-664210',
        name: credentials?.name || (tType === 'formal' ? MOCK_TRAINEE.full_name : 'Vikram Singh'),
        token: `mock-jwt-token-trainee-${Date.now()}`,
        trainee_type: tType,
        traineeProfile: {
          ...MOCK_TRAINEE,
          full_name: credentials?.name || (tType === 'formal' ? MOCK_TRAINEE.full_name : 'Vikram Singh'),
          trainee_id: tType === 'formal' ? 'TR-884920' : 'TR-664210',
          vid: cleanVid,
          consent_given: true,
          trainee_type: tType
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
        name: credentials?.name || 'District Officer Sharma (Patna)',
        token: `mock-jwt-token-officer-${Date.now()}`
      };
    }

    setUser(session);
    localStorage.setItem('livelihood_user_session', JSON.stringify(session));
    return true;
  };

  const registerAsRole = async (
    role: Role,
    data: TraineeRegData | EmployerRegData | OfficerRegData
  ): Promise<boolean> => {
    let session: UserSession;

    if (role === 'trainee') {
      const tData = data as TraineeRegData;
      const cleanVid = tData.vid ? tData.vid.replace(/\D/g, '') : '982344128801';
      const traineeId = `TR-${Math.floor(100000 + Math.random() * 900000)}`;
      session = {
        role: 'trainee',
        id: traineeId,
        name: tData.fullName,
        token: `mock-jwt-token-trainee-reg-${Date.now()}`,
        trainee_type: tData.traineeType,
        traineeProfile: {
          ...MOCK_TRAINEE,
          full_name: tData.fullName,
          trainee_id: traineeId,
          vid: cleanVid,
          consent_given: true,
          trainee_type: tData.traineeType,
          sector: tData.skillTrade || MOCK_TRAINEE.sector,
          training_center: tData.tcId || MOCK_TRAINEE.training_center,
          district: tData.stateDistrict || MOCK_TRAINEE.district,
          phone: tData.phone || MOCK_TRAINEE.phone
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
    if (user && user.traineeProfile) {
      const updatedProfile = { ...user.traineeProfile, consent_given: true };
      const updatedUser = { ...user, traineeProfile: updatedProfile };
      setUser(updatedUser);
      localStorage.setItem('livelihood_user_session', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('livelihood_user_session');
  };

  const updateTrustTier = (tier: number) => {
    if (user && user.traineeProfile) {
      const updatedProfile = { ...user.traineeProfile, trust_tier: tier };
      const updatedUser = { ...user, traineeProfile: updatedProfile };
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

