import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useStudySubsite } from "@/components/context/siteContext";
import { ImageType as BaseImageType } from '@/types/Types';

interface ImageType extends BaseImageType {
  modality_level2: string;
}

interface VisualDataItem {
  image_url: string;
  width: number;
  height: number;
  detections: any[]; 
  chat?: any[]; 
}

interface VisualDataContextType {
  visualData: ImageType[] | null;
  filteredData: ImageType[] | null;
  isLoading: boolean;
  error: Error | null;
  user: any | null;
  loadUser: () => Promise<void>;
  filterData: (taxa: string[], types: string[]) => void;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

interface VisualDataProviderProps {
  children: ReactNode;
}

const VisualDataContext = createContext<VisualDataContextType | undefined>(undefined);

export const VisualDataProvider: React.FC<VisualDataProviderProps> = ({ children }) => {
  const [visualData, setVisualData] = useState<ImageType[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { selectedSubsite, setSelectedSubsite } = useStudySubsite(); 
  const [initialLoadDone, setInitialLoadDone] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [filteredData, setFilteredData] = useState<ImageType[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const fragment = window.location.hash.substring(1);
    const params = new URLSearchParams(fragment);
    const siteId = params.get('site');
    if (siteId) {
      setSelectedSubsite(siteId);
    }
  }, [setSelectedSubsite]);

  useEffect(() => {
    async function loadData(subsiteId: string) {
      setIsLoading(true);
      setError(null);
      try {
        const url = subsiteId 
          ? `/api/fetchsupa?siteId=${subsiteId}`
          : '/api/fetchsupa';
        console.log('Fetching data from:', url);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Received data:', data);
        setVisualData(data);
      } catch (error: unknown) {
        console.error('Error fetching data:', error);
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('An unknown error occurred'));
        }
        setVisualData(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (!initialLoadDone && selectedSubsite) {
      console.log('Initial load for default subsite:', selectedSubsite);
      loadData(selectedSubsite);
      setInitialLoadDone(true);
    } else if (initialLoadDone && selectedSubsite) {
      console.log('Selected subsite changed:', selectedSubsite);
      loadData(selectedSubsite);
    }
  }, [selectedSubsite, initialLoadDone]);

  useEffect(() => {
    if (selectedSubsite) {
      const pathname = window.location.pathname;
      if (pathname === '/platform/annotate/image') {
        window.history.replaceState(null, '', `#site=${selectedSubsite}&index=${currentIndex}`);
      } else {
        window.history.replaceState(null, '', `#site=${selectedSubsite}`);
      }
    }
  }, [selectedSubsite, currentIndex]);

  const loadUser = async () => {
    try {
      const response = await fetch('/api/getuser');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const userData = await response.json();
      setUser(userData[0]);
    } catch (error: unknown) {
      console.error('Error fetching user data:', error);
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('An unknown error occurred');
      }
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const filterData = useCallback((taxa: string[], types: string[]) => {
    if (!visualData) return;
  
    if (taxa.length === 0 && types.length === 0) {
      setFilteredData(visualData);
      return;
    }
  
    const filtered = visualData.filter(item => {
      const typeMatch = types.length === 0 || types.includes(item.modality_level2);
      
      if (!typeMatch) return false;
      
      if (taxa.length === 0) return true;
      
      if (!item.detections) return false;
      const detections = Array.isArray(item.detections) ? item.detections : JSON.parse(item.detections);
      return detections.some((detection: any) => {
        const hasNonEmptyLabels = detection.labels && 
          detection.labels.some((label: string[]) => label.some(l => l.trim() !== ''));
        
        return hasNonEmptyLabels && taxa.includes(detection.taxa.toLowerCase());
      });
    });
  
    setFilteredData(filtered);
  }, [visualData]);

  useEffect(() => {
    if (visualData) {
      setFilteredData(visualData);
    }
  }, [visualData]);

  return (
    <VisualDataContext.Provider value={{ 
      visualData, 
      filteredData, 
      isLoading, 
      error, 
      user, 
      loadUser, 
      filterData,
      currentIndex,
      setCurrentIndex
    }}>
      {children}
    </VisualDataContext.Provider>
  );
};



export const useVisualData = (): VisualDataContextType => {
  const context = useContext(VisualDataContext);
  if (context === undefined) {
    throw new Error('useVisualData must be used within a VisualDataProvider');
  }
  return context;
};