import React from 'react';

interface RightPanelProps {
  children: React.ReactNode;
}

export function RightPanel({ children }: RightPanelProps) {
  return (
    <div id="right-panel" className="right-panel">
      {children}
    </div>
  );
}