import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust the path to your firebase.js file
import CircularProgress from "react-native-circular-progress-indicator";

// Function to calculate color based on score
const getProgressColor = (score) => {
  // Score ranges from 0 (red) to 25 (green)
  const normalizedScore = (score / 25) * 100; // Normalize to 0–100
  const red = Math.round(255 - (normalizedScore / 100) * 255); // Decrease red as score increases
  const green = Math.round((normalizedScore / 100) * 255); // Increase green as score increases
  return `rgb(${red}, ${green}, 0)`; // No blue component
};

const EnvironmentalPillarScreen = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "questionnaireResponses")
        );
        const fetchedData = [];
        querySnapshot.forEach((doc) => {
          const { topic, totalScore } = doc.data();
          fetchedData.push({ label: topic, score: totalScore });
        });
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Environmental Pillar</Text>
      <View style={styles.grid}>
        {data.map((cell, index) => (
          <View key={index} style={styles.cell}>
            <CircularProgress
              value={cell.score}
              radius={50}
              maxValue={25} // Updated max value
              progressValueStyle={styles.progressValue}
              activeStrokeColor={getProgressColor(cell.score)} // Dynamic color
              inActiveStrokeColor="#e0e0e0"
              activeStrokeWidth={10}
              inActiveStrokeWidth={10}
            />
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
    paddingTop: 45,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 16,
    backgroundColor: "#007c7c",
    padding: 20,
    borderRadius: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap", // Allow wrapping to a new row
    justifyContent: "space-between", // Space evenly between items
  },
  cell: {
    width: "30%", // Ensure three items per row
    height: 150, // Fixed height to align all circles
    marginVertical: 10,
    justifyContent: "flex-start", // Start content at the top of the cell
    alignItems: "center",
  },
  progressValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007c7c",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#007c7c",
    textAlign: "center", // Center-align text
    marginTop: 8,
  },
});
export default EnvironmentalPillarScreen;
