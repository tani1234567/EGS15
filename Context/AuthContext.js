import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import { firestore } from "../firebase"; // Firestore import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize state to hold user data
  const [loading, setLoading] = useState(true); // Keep track of loading state
  const auth = getAuth();
  const [companyId, setCompanyId] = useState(null);
  const [companyName, setCompanyName] = useState(null);

  // Load user session from AsyncStorage on app startup
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);

          if (parsedUser && parsedUser.uid) {
            console.log("User loaded from AsyncStorage:", parsedUser);
            setUser(parsedUser); // Set the user if uid is found
          }
        }
      } catch (error) {
        console.error("Error loading user from AsyncStorage:", error);
      } finally {
        setLoading(false); // Stop loading after checking AsyncStorage
      }
    };

    loadUserFromStorage();
  }, []);

  // Listen to Firebase authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        const authenticatedUser = {
          uid: authUser.uid,
          email: authUser.email,
          name: authUser.displayName,
        };

        // Update user context and AsyncStorage with Firebase authenticated user
        AsyncStorage.setItem("user", JSON.stringify(authenticatedUser));
        setUser(authenticatedUser);
        console.log("User authenticated by Firebase:", authenticatedUser);
      } else {
        setUser(null); // If no user is authenticated, reset user state
        AsyncStorage.removeItem("user");
        console.log("No user authenticated");
      }
      setLoading(false); // Ensure loading is false when authentication state is ready
    });

    return unsubscribe; // Clean up the listener on unmount
  }, []);

  // Login function
  const login = async (employeeId, password) => {
    try {
      // Fetch employee data using employeeId from Firestore
      const employeeDoc = await firestore
        .collection("employees")
        .where("employeeId", "==", employeeId)
        .get();

      if (!employeeDoc.empty) {
        const employeeData = employeeDoc.docs[0].data();

        // Ensure necessary fields exist in the employee data
        if (
          !employeeData.uid ||
          !employeeData.employeeId ||
          !employeeData.department
        ) {
          throw new Error("Incomplete employee data.");
        }

        const userData = {
          uid: employeeData.uid,
          employeeId: employeeData.employeeId,
          department: employeeData.department,
        };

        // Store user data in AsyncStorage and update the context
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        setUser(userData); // Update the user state
        console.log("Login successful. User data:", userData);
      } else {
        throw new Error("Employee not found.");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase Auth
      await AsyncStorage.removeItem("user"); // Clear user session from AsyncStorage
      setUser(null); // Reset user state
      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        logout,
        companyId,
        setCompanyId,
        companyName,
        setCompanyName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
