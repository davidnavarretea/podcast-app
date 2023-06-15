import React, { createContext, useState, useContext } from "react";

const AppContext = createContext();

export function AppWrapper({ children }) {
  // Manages the loading state
  const [loading, setLoading] = useState(false);

  // Creates a shared state object with the loading state and setLoading function
  let sharedState = {
    loading,
    setLoading,
  };

  // Provides the shared state value to the children components through AppContext.Provider
  return (
    <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>
  );
}

export function useAppContext() {
  // Custom hook that returns the app context value
  return useContext(AppContext);
}
