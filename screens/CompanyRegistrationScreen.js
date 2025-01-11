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
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const CompanyRegistrationScreen = ({ navigation }) => {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateInputs = () => {
    if (!companyName || !email || !password) {
      Alert.alert("Error", "All fields are required!");
      return false;
    }

    if (companyName.length < 3) {
      Alert.alert("Error", "Company name must be at least 3 characters long.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return false;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Error",
        "Password must be at least 8 characters long, include at least one uppercase letter, one number, and one special character."
      );
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    try {
      const docRef = await addDoc(collection(db, "companies"), {
        name: companyName,
        email: email.toLowerCase(),
        password,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Company registered successfully!");
      navigation.navigate("CompanyLoginScreen");
    } catch (error) {
      console.error("Error adding document:", error);
      Alert.alert("Error", "Failed to register the company!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Company Registration</Text>

      <TextInput
        style={styles.input}
        placeholder="Company Name"
        value={companyName}
        onChangeText={setCompanyName}
      />

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

      <Button title="Register" onPress={handleRegister} />

      <TouchableOpacity
        onPress={() => navigation.navigate("CompanyLoginScreen")}
        style={styles.hyperlink}
      >
        <Text style={styles.hyperlinkText}>Already Registered Your Company? Login here</Text>
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
  hyperlink: {
    marginTop: 16,
  },
  hyperlinkText: {
    fontSize: 16,
    color: "#007BFF",
  },
});

export default CompanyRegistrationScreen;
