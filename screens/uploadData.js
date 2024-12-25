import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { db } from "../firebase"; // Ensure this is the correct path to firebase.js
import questionnaireData from "../data/questionnaireData.json"; // Path to your JSON file
import { doc, collection, setDoc } from "firebase/firestore";

const UploadData = () => {
  const handleUpload = async () => {
    try {
      // Loop through departments in the JSON
      for (const department in questionnaireData) {
        const departmentRef = doc(db, "Departments", department);

        for (const topic in questionnaireData[department]) {
          const topicData = questionnaireData[department][topic];

          const topicRef = doc(collection(departmentRef, "Topics"), topic);
          await setDoc(topicRef, {
            topicName: topic,
          });

          for (let i = 0; i < topicData.length; i++) {
            const question = topicData[i];

            const questionRef = doc(
              collection(topicRef, "Questions"),
              `Question${i + 1}`
            );
            await setDoc(questionRef, {
              question: question.question,
              options: question.options,
              weights: question.weights,
            });
          }
        }
      }
      console.log("Questionnaire data successfully uploaded to Firestore!");
    } catch (error) {
      console.error("Error uploading data to Firestore:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Upload Data to Firestore</Text>
      <Button title="Upload Data" onPress={handleUpload} />
    </View>
  );
};

export default UploadData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});
