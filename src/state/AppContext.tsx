import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type Role = 'worker' | 'employer';

type AppState = {
  role: Role | null;
  setRole: (role: Role | null) => void;
  selectedSkills: string[];
  toggleSkill: (id: string) => void;
  available: boolean;
  setAvailable: (value: boolean) => void;
  savedWorkerIds: string[];
  toggleSaved: (id: string) => void;
  language: string;
  setLanguage: (id: string) => void;
  lastSpoken: string | null;
  speak: (label: string) => void;
};

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [available, setAvailable] = useState(true);
  const [savedWorkerIds, setSavedWorkerIds] = useState<string[]>([]);
  const [language, setLanguage] = useState<string>('en');
  const [lastSpoken, setLastSpoken] = useState<string | null>(null);

  const toggleSkill = useCallback((id: string) => {
    setSelectedSkills((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setSavedWorkerIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }, []);

  // Mock voice affordance: records what was "spoken" so screens can show feedback.
  const speak = useCallback((label: string) => {
    setLastSpoken(label);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      role,
      setRole,
      selectedSkills,
      toggleSkill,
      available,
      setAvailable,
      savedWorkerIds,
      toggleSaved,
      language,
      setLanguage,
      lastSpoken,
      speak,
    }),
    [role, selectedSkills, toggleSkill, available, savedWorkerIds, toggleSaved, language, lastSpoken, speak]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return ctx;
}
