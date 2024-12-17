import React, { useContext, useState, useEffect } from "react";
import { View, Text, Alert, FlatList, StyleSheet, Button } from "react-native";
import { AuthContext } from "../Context/AuthContext"; // Import AuthContext
import { addDoc, collection } from "firebase/firestore"; // Firebase imports
import { db } from "../firebase";
import questionnaire from "../data/questionnaireData.json"; // Import your questionnaire.json
import { RadioButton } from "react-native-paper"; // Import RadioButton

const QuestionsScreen = ({ navigation, route }) => {
  const { user, loading } = useContext(AuthContext); // Access user and loading from AuthContext
  const { topic } = route.params; // Get the topic from navigation params
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    console.log("QuestionsScreen: user", user);
    console.log("QuestionsScreen: loading", loading);

    // Ensure the user data is loaded and accessible
    if (loading) return; // Wait for loading state to be false
    if (!user || !user.department) {
      Alert.alert("Error", "User department not found. Please log in again.");
      return;
    }

    // Locate the questions for the given department and topic
    const departmentQuestions = questionnaire[user.department];
    if (!departmentQuestions) {
      Alert.alert("Error", "No data found for this department.");
      return;
    }

    // Find the topic data within the department
    const topicData = departmentQuestions[topic];
    if (topicData) {
      setQuestions(topicData);
    } else {
      Alert.alert(
        "Error",
        "No questions found for the selected topic. Please try another."
      );
    }
  }, [user, loading, topic]); // Ensure useEffect runs only when user, loading, or topic change

  const handleOptionSelect = (questionIndex, weight) => {
    setResponses((prev) => ({
      ...prev,
      [questionIndex]: weight,
    }));
  };

  const calculateScore = () => {
    return Object.values(responses).reduce((sum, weight) => sum + weight, 0);
  };

  const handleSubmit = async () => {
    const totalScore = calculateScore();

    try {
      // Check if user is authenticated by checking user.employeeId or user.id (based on your data)
      if (!user || !user.employeeId) {
        // Update this to check for employeeId instead of uid
        Alert.alert("Error", "User not authenticated. Please log in again.");
        return;
      }

      // Save the score in Firestore
      // Use db instead of firestore
      await addDoc(collection(db, "questionnaireResponses"), {
        topic: topic,
        score: totalScore,
        userId: user.employeeId, // Use employeeId as the identifier for the user
        department: user.department,
        timestamp: new Date(),
      });

      Alert.alert("Success", "Your responses have been submitted!");
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting responses: ", error);
      Alert.alert(
        "Error",
        "Failed to submit your responses. Please try again."
      );
    }
  };


  // Render loading state while user data is still being loaded
  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.topicText}>{`Topic: ${topic}`}</Text>
      <FlatList
        data={questions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{item.question}</Text>
            {item.options.map((option, optionIndex) => (
              <View key={optionIndex} style={styles.optionContainer}>
                <RadioButton
                  value={item.weights[optionIndex]}
                  status={
                    responses[index] === item.weights[optionIndex]
                      ? "checked"
                      : "unchecked"
                  }
                  onPress={() =>
                    handleOptionSelect(index, item.weights[optionIndex])
                  }
                />
                <Text>{option}</Text>
              </View>
            ))}
          </View>
        )}
      />
      <Button title="Submit" onPress={handleSubmit} color="#6200EE" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9F9F9", // Light gray background
  },
  topicText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333", // Dark gray for topic title
  },
  questionContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#FFFFFF", // White background for questions
    elevation: 2, // Add a slight shadow for card-like effect
  },
  questionText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333", // Dark gray for question text
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
});

export default QuestionsScreen;
