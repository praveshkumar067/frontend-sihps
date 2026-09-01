'use client';

import React, { createContext, useContext, useState } from 'react';
import { Role } from '../types';

interface RoleContextType {
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  isMockData: boolean;
  setIsMockData: (val: boolean) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<Role>('trainee');
  const [isMockData, setIsMockData] = useState<boolean>(true);

  return (
    <RoleContext.Provider value={{ activeRole, setActiveRole, isMockData, setIsMockData }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
