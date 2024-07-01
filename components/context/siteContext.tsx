"use client"

import { createContext, useState, useContext, ReactNode } from "react";

interface StudySubsiteContextType {
  selectedSubsite: string | null;
  setSelectedSubsite: (subsite: string | null) => void;
}

const StudySubsiteContext = createContext<StudySubsiteContextType | undefined>(undefined);

export const StudySubsiteProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSubsite, setSelectedSubsite] = useState<string | null>(null);

  return (
    <StudySubsiteContext.Provider value={{ selectedSubsite, setSelectedSubsite }}>
      {children}
    </StudySubsiteContext.Provider>
  );
};

export const useStudySubsite = () => {
  const context = useContext(StudySubsiteContext);
  if (!context) {
    throw new Error("useStudySubsite must be used within a StudySubsiteProvider");
  }
  return context;
};