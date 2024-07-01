"use client"

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface InsightsContextType {
  checkedInsights: string[];
  toggleInsight: (insight: string) => void;
}

const InsightsContext = createContext<InsightsContextType | undefined>(undefined);

export function InsightsProvider({ children }: { children: ReactNode }) {
  const [checkedInsights, setCheckedInsights] = useState<string[]>([]);

  const toggleInsight = (insight: string) => {
    setCheckedInsights(prev =>
      prev.includes(insight)
        ? prev.filter(item => item !== insight)
        : [...prev, insight]
    );
  };

  return (
    <InsightsContext.Provider value={{ checkedInsights, toggleInsight }}>
      {children}
    </InsightsContext.Provider>
  );
}

export function useInsights() {
  const context = useContext(InsightsContext);
  if (context === undefined) {
    throw new Error('useInsights must be used within an InsightsProvider');
  }
  return context;
}