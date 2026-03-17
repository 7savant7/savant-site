import React, { createContext, useContext, useState, useCallback } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  progress: number;
  setLoading: (loading: boolean) => void;
  setProgress: (progress: number) => void;
  finishLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const finishLoading = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  // Safety timeout to prevent stuck preloader
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.warn('Loading safety timeout triggered');
        finishLoading();
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, [isLoading, finishLoading]);

  return (
    <LoadingContext.Provider value={{ isLoading, progress, setLoading, setProgress, finishLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
