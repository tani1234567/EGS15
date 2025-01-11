import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { db } from "../firebase"; // Import Firebase config
import { collection, query, where, getDocs } from "firebase/firestore";
import { AuthContext } from "../Context/AuthContext"; // Import AuthContext

const CompanyLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setCompanyId, setCompanyName } = useContext(AuthContext); // Access context

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

      if (!querySnapshot.empty) {
        Alert.alert("Success", "Login successful!");
        const companyData = querySnapshot.docs[0].data();
        setCompanyId(querySnapshot.docs[0].id);
        setCompanyName(companyData.name);

        navigation.navigate("EmployeeLoginScreen", {
          companyId: querySnapshot.docs[0].id,
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
      {/* Add Image at the Top */}
      <Image
        source={require("../images/ESG1.jpg")} // Replace with your image path
        style={styles.logo}
        resizeMode="contain"
      />

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
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
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
    backgroundColor: "#f0f8ff",
  },
  logo: {
    width: 350,
    height: 200,
    marginBottom: 10,
    borderRadius:20,
    marginTop:20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
