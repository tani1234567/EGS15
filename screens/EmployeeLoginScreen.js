import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { db } from "../firebase"; // Firebase configuration
import { collection, query, where, getDocs } from "firebase/firestore";
import { AuthContext } from "../Context/AuthContext"; // Import AuthContext

const EmployeeLoginScreen = ({ navigation, route }) => {
  const { companyId } = route.params; // Get the companyId from the previous screen
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(AuthContext); // Use setUser to update user data

  const validateInputs = () => {
    if (!employeeId || !password) {
      Alert.alert("Error", "Both fields are required!");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      const q = query(
        collection(db, "employees"),
        where("companyId", "==", companyId),
        where("employeeId", "==", employeeId),
        where("password", "==", password)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const employeeData = querySnapshot.docs[0].data();

        Alert.alert("Success", "Login successful!");
        console.log("Employee found:", employeeData);

        // Set the employee's data in AuthContext using setUser
        setUser({
          employeeId: querySnapshot.docs[0].id,
          department: employeeData.department, // Set department
          name: employeeData.name,
        });

        // Navigate to the Questionnaire Topics screen
        navigation.navigate("QuestionnaireTopicsScreen");
      } else {
        Alert.alert("Error", "Invalid Employee ID or Password!");
      }
    } catch (error) {
      console.error("Error during employee login:", error);
      Alert.alert("Error", "Failed to login. Please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Employee ID"
        value={employeeId}
        onChangeText={setEmployeeId}
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

      {/* Link to Employee Registration Screen */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("EmployeeRegistrationScreen", { companyId })
        }
        style={styles.registerLink}
      >
        <Text style={styles.registerText}>
          Not registered? Register as an employee
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

export default EmployeeLoginScreen;
