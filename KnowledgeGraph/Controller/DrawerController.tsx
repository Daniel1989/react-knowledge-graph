import React, { createContext, useContext, useState } from 'react';

interface DrawerState {
  isOpen: boolean;
  rootId: string | null;
}

interface DrawerContextType {
  drawerState: DrawerState;
  openDrawer: (rootId: string) => void;
  closeDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [drawerState, setDrawerState] = useState<DrawerState>({
    isOpen: false,
    rootId: null,
  });

  const openDrawer = (rootId: string) => {
    setDrawerState({ isOpen: true, rootId });
  };

  const closeDrawer = () => {
    setDrawerState({ isOpen: false, rootId: null });
  };

  return (
    <DrawerContext.Provider value={{ drawerState, openDrawer, closeDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
} 