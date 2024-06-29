'use client'

// ModeContext.tsx
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import React, { ReactNode, createContext, useContext, useState } from 'react'

type ModeContextType = {
  mode: string;
  setMode: (value: string) => void;
} | null;

const ModeContext = createContext<ModeContextType>(null);

export const ModeProvider = ({ children }: { children: ReactNode}) => {
  const [mode, setMode] = useLocalStorage<string>(
    'NEXT_PUBLIC_STORAGE_MODE',
    process.env.NEXT_PUBLIC_STORAGE_MODE || 'local'
  );

  return (
    <ModeContext.Provider value={{ mode, setMode}}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (context === null) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};