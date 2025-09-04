
import React, { createContext, useState, useContext } from 'react';

const RefreshContext = createContext();
export const useRefresh = () => useContext(RefreshContext);
export const RefreshProvider = ({ children }) => {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <RefreshContext.Provider value={{ refreshing, onRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};
