import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust the path to your firebase.js file

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
            style={[styles.cell, { backgroundColor: cell.color || "#8c8c8c" }]} // Default color if not provided
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
    borderRadius:10
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap", // Wrap rows automatically
    justifyContent: "flex-start", // Distribute cells evenly
  },
  cell: {
    width: "30.33%", // Ensures 3 columns with adaptive spacing
    aspectRatio: 1, // Makes cells square
    marginVertical: 6,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal:5 
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
