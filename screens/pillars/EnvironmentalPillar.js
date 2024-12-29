import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const EnvironmentalPillarScreen = () => {
  const data = [
    { label: "Product Carbon Footprint", score: 21, color: "#FF0000" },
    { label: "Natural Resource Utilization", score: 45, color: "#FFA500" },
    { label: "Pollution", score: 65, color: "#ADFF2F" },
    { label: "Carbon Emission", score: 91, color: "#008000" },
    { label: "Waste Management", score: 65, color: "#008000" },
    { label: "Recycling", score: 27, color: "#FF4500" },
  ];

  // Rearrange data into 3 columns
  const numColumns = 3;
  const rows = [];
  for (let i = 0; i < data.length; i += numColumns) {
    rows.push(data.slice(i, i + numColumns));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Environmental Pillar</Text>
      <View style={styles.grid}>
        {data.map((cell, index) => (
          <View
            key={index}
            style={[styles.cell, { backgroundColor: cell.color }]}
          >
            <Text style={styles.score}>{cell.score}</Text>
            <Text style={styles.label}>{cell.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 16,
    backgroundColor: "#007c7c",
    padding: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap", // Wrap rows automatically
    justifyContent: "space-between", // Distribute cells evenly
  },
  cell: {
    width: "30.33%", // Ensures 3 columns with adaptive spacing
    aspectRatio: 1, // Makes cells square
    marginVertical: 6,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  score: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 6,
  },
});

export default EnvironmentalPillarScreen;
