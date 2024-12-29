import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const DashboardScreen = ({ navigation }) => {
  const handleNavigate = (page) => {
    navigation.navigate(page); // Navigate to the specified page
  };

  return (
    <View style={styles.container}>
      {/* Environmental Pillar */}
      <TouchableOpacity
        style={styles.widget}
        onPress={() => handleNavigate("EnvironmentalPillar")}
      >
        <Text style={styles.widgetText}>Environmental Pillar</Text>
      </TouchableOpacity>

      {/* Social Pillar */}
      <TouchableOpacity
        style={styles.widget}
        onPress={() => handleNavigate("SocialPillar")}
      >
        <Text style={styles.widgetText}>Social Pillar</Text>
      </TouchableOpacity>

      {/* Governance Pillar */}
      <TouchableOpacity
        style={styles.widget}
        onPress={() => handleNavigate("GovernancePillar")}
      >
        <Text style={styles.widgetText}>Governance Pillar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  widget: {
    width: "90%",
    height:"20%",
    padding: 20,
    marginVertical: 10,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3, // Adds shadow on Android
    shadowColor: "#000", // Adds shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  widgetText: {
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default DashboardScreen;
