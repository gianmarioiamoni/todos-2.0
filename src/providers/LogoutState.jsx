import { createContext, useContext, useMemo, useState } from 'react';

const LogoutStateContext = createContext({
  isLogout: true
});
export function LogoutState({ children }) {
  const [isLogout, setIsLogout] = useState(true);

  const value = useMemo(
    () => ({
      isLogout,
      setIsLogout,
    }),
    [isLogout]
  );

  return (
    <LogoutStateContext.Provider value={value}>
      {children}
    </LogoutStateContext.Provider>
  );
}

export function useLogoutState() {
  const context = useContext(LogoutStateContext);

  if (context === undefined) {
    throw new Error('useLogoutState must be used within a AppStateProvider');
  }

  return context;
}
