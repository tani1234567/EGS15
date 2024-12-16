import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth"; // Removed unused signInWithEmailAndPassword
import { auth, firestore } from "../firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user session from AsyncStorage on app startup
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error loading user from storage:", error);
      } finally {
        setLoading(false); // Ensure loading stops even if there's an error
      }
    };
    loadUserFromStorage();
  }, []);

  // Login function
  const login = async (employeeId, password) => {
    try {
      // Fetch the employee data using the employee ID
      const employeeDoc = await firestore
        .collection("employees")
        .where("employeeId", "==", employeeId)
        .get();

      if (!employeeDoc.empty) {
        const employeeData = employeeDoc.docs[0].data();

        // Ensure these fields exist in the Firestore document
        if (
          !employeeData.uid ||
          !employeeData.employeeId ||
          !employeeData.department
        ) {
          throw new Error("Incomplete employee data in Firestore.");
        }

        const userData = {
          uid: employeeData.uid,
          employeeId: employeeData.employeeId,
          department: employeeData.department,
        };

        // Store the employee data in AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      } else {
        throw new Error("Employee not found."); // Throw error if no matching document
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Re-throw the error to handle it in the login screen
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase Auth (optional)
      await AsyncStorage.removeItem("user"); // Clear user session
      setUser(null); // Reset user state
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
