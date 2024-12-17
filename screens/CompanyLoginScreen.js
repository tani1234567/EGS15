import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity, 
} from "react-native";
import { db } from "../firebase"; // Import Firebase config
import { collection, query, where, getDocs } from "firebase/firestore";

const CompanyLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = () => {
    if (!email || !password) {
      Alert.alert("Error", "Both fields are required!");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      const q = query(
        collection(db, "companies"),
        where("email", "==", email.toLowerCase()),
        where("password", "==", password)
      );
      const querySnapshot = await getDocs(q);

      console.log("Query result:", querySnapshot.docs); // Log query result

      if (!querySnapshot.empty) {
        Alert.alert("Success", "Login successful!");
        console.log("Company found:", querySnapshot.docs[0].data());

        // Navigate to Employee Login Screen
        navigation.navigate("EmployeeLoginScreen", {
          companyId: querySnapshot.docs[0].id, // Pass company ID
        });
      } else {
        Alert.alert("Error", "Invalid email or password!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Error", "Failed to login. Please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Company Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}

      {/* Link to the Company Registration Screen */}
      <TouchableOpacity
        onPress={() => navigation.navigate("CompanyRegistrationScreen")}
        style={styles.registerLink}
      >
        <Text style={styles.registerText}>
          Not registered? Register your company
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
  registerLink: {
    marginTop: 16,
  },
  registerText: {
    color: "#007BFF",
    fontSize: 16,
  },
});

export default CompanyLoginScreen;
