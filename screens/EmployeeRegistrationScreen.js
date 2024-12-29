import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { db } from "../firebase"; // Firebase config
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import DropDownPicker from "react-native-dropdown-picker";

const EmployeeRegistrationScreen = ({ navigation, route }) => {
  const { companyId } = route.params; // Company ID passed from the Employee Login Screen

  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(""); // Added email field
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [open, setOpen] = useState(false); // For DropDownPicker
  const [departments, setDepartments] = useState([
    {
      label: "Environmental Health & Safety",
      value: "Environmental Health & Safety",
    },
    { label: "Finance", value: "Finance" },
    { label: "IT", value: "IT" },
    { label: "Resource Management", value: "Resource Management" },
    { label: "Sustainability", value: "Sustainability" },
    { label: "Waste Management", value: "Waste Management" },
  ]);

  const validateInputs = async () => {
    if (!employeeId || !name || !phone || !email || !password || !department) {
      Alert.alert("Error", "All fields are required!");
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      Alert.alert("Error", "Phone number must be 10 digits!");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Error", "Please enter a valid email address!");
      return false;
    }

    // Check if Employee ID is unique within the company
    const q = query(
      collection(db, "employees"),
      where("companyId", "==", companyId),
      where("employeeId", "==", employeeId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      Alert.alert(
        "Error",
        "Employee ID already exists. Choose a different ID."
      );
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (isSubmitting) return;

    const isValid = await validateInputs();
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      // Add employee to Firestore
      await addDoc(collection(db, "employees"), {
        companyId, // Link employee to the company
        employeeId,
        name,
        phone,
        email, // Save the email in Firestore
        password,
        department,
      });

      Alert.alert("Success", "Employee registered successfully!");
      navigation.goBack(); // Navigate back to Employee Login Screen
    } catch (error) {
      console.error("Error registering employee:", error);
      Alert.alert("Error", "Failed to register employee. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee Registration</Text>

      <TextInput
        style={styles.input}
        placeholder="Employee ID"
        value={employeeId}
        onChangeText={setEmployeeId}
      />

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <DropDownPicker
        open={open}
        value={department}
        items={departments}
        setOpen={setOpen}
        setValue={setDepartment}
        setItems={setDepartments}
        placeholder="Select Department"
        style={styles.dropdown}
      />

      {isSubmitting ? (
        <Text>Registering...</Text>
      ) : (
        <Button title="Register" onPress={handleRegister} />
      )}
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
  dropdown: {
    width: "100%",
    marginBottom: 16,
  },
});

export default EmployeeRegistrationScreen;
