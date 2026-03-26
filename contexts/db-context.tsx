import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { getDb } from '@/lib/db/client';
import { theme } from '@/constants/theme';

interface DBContextValue {
  isReady: boolean;
}

const DBContext = createContext<DBContextValue>({ isReady: false });

export function DBProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    getDb()
      .then(() => setIsReady(true))
      .catch(console.error);
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator color={theme.colors.ink} />
      </View>
    );
  }

  return (
    <DBContext.Provider value={{ isReady }}>
      {children}
    </DBContext.Provider>
  );
}

export function useDBContext() {
  return useContext(DBContext);
}
