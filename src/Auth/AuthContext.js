import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

// Initialize Firebase auth
const auth = getAuth();

// Create the AuthContext
const AuthContext = createContext();

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // To store the authenticated user

  useEffect(() => {
    // Listen for changes in the authentication state
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser); // Set the authenticated user in state
    });

    return () => {
      unsubscribe(); // Cleanup the subscription when the component unmounts
    };
  }, []);

  // Define the signout function
  const handleSignout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Create the value object to provide to the context
  const value = {
    user, // The authenticated user object
    signout: handleSignout, // Function to sign the user out
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };