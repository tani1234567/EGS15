import React, { useContext, useState, useEffect } from "react";
import { View, Text, Alert, StyleSheet, Button } from "react-native";
import { AuthContext } from "../Context/AuthContext"; // Import AuthContext
import {
  collection,
  doc,
  getDocs,
  addDoc,
  query,
  where,
} from "firebase/firestore"; // Firebase imports
import { db } from "../firebase"; // Firebase configuration
import { RadioButton } from "react-native-paper"; // Import RadioButton

const QuestionsScreen = ({ navigation, route }) => {
  const { user, loading, companyId, companyName } = useContext(AuthContext); // Access companyId, companyName from AuthContext
  const { topic } = route.params; // Get the topic from navigation params
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAlreadyFilled, setIsAlreadyFilled] = useState(false); // To track if questionnaire is already filled

  useEffect(() => {
    const checkIfAlreadyFilled = async () => {
      if (loading) return; // Wait for the loading state to complete

      if (!user || !user.employeeId || !companyId || !topic) {
        Alert.alert("Error", "Required data not found. Please log in again.");
        return;
      }

      try {
        // Check if questionnaire has already been filled for this user, company, and topic
        const responsesRef = collection(db, "questionnaireResponses");
        const q = query(
          responsesRef,
          where("companyId", "==", companyId),
          where("userId", "==", user.employeeId),
          where("topic", "==", topic)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // If there are responses for this user, company, and topic
          setIsAlreadyFilled(true); // Set state to show message
        }
      } catch (error) {
        console.error("Error checking questionnaire fill status: ", error);
        Alert.alert("Error", "Failed to check if questionnaire is filled.");
      }
    };

    const fetchQuestions = async () => {
      if (isAlreadyFilled) return; // Skip fetching questions if already filled

      if (!user || !user.department) {
        Alert.alert("Error", "User department not found. Please log in again.");
        return;
      }

      try {
        // Fetch questions from Firebase Firestore
        const departmentRef = doc(db, "Departments", user.department);
        const topicRef = collection(
          departmentRef,
          "Topics",
          topic,
          "Questions"
        );
        const querySnapshot = await getDocs(topicRef);

        const fetchedQuestions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching questions: ", error);
        Alert.alert(
          "Error",
          "Failed to fetch questions. Please try again later."
        );
      } finally {
        setIsLoading(false); // End loading state
      }
    };

    checkIfAlreadyFilled();
    fetchQuestions();
  }, [user, loading, companyId, topic, isAlreadyFilled]);

  const handleOptionSelect = (weight) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestionIndex]: weight,
    }));
  };

  const handleNext = () => {
    if (responses[currentQuestionIndex] === undefined) {
      Alert.alert("Error", "Please select an option before proceeding.");
      return;
    }
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const calculateScore = () => {
    return Object.values(responses).reduce((sum, weight) => sum + weight, 0);
  };

  const handleSubmit = async () => {
    const totalScore = calculateScore();
    const responseDetails = questions.map((question, index) => ({
      question: question.question,
      selectedOption: question.options.find(
        (_, i) => question.weights[i] === responses[index]
      ),
      weight: responses[index],
    }));

    try {
      // Ensure user is authenticated
      if (!user || !user.employeeId) {
        Alert.alert("Error", "User not authenticated. Please log in again.");
        return;
      }

      // Save the responses with question details, score, companyId, and companyName in Firestore
      await addDoc(collection(db, "questionnaireResponses"), {
        topic: topic,
        totalScore: totalScore,
        userId: user.employeeId, // Use employeeId as the identifier for the user
        department: user.department,
        companyId: companyId, // Store companyId
        companyName: companyName, // Store companyName
        timestamp: new Date(),
        responses: responseDetails, // Add the question and selected responses here
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

  if (isLoading || loading) {
    return <Text>Loading...</Text>;
  }

  if (isAlreadyFilled) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>
          You have already filled out this questionnaire.
        </Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <View style={styles.container}>
      <Text style={styles.topicText}>{`Topic: ${topic}`}</Text>
      {currentQuestion && (
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          {currentQuestion.options.map((option, optionIndex) => (
            <View key={optionIndex} style={styles.optionContainer}>
              <RadioButton
                value={currentQuestion.weights[optionIndex]}
                status={
                  responses[currentQuestionIndex] ===
                  currentQuestion.weights[optionIndex]
                    ? "checked"
                    : "unchecked"
                }
                onPress={() =>
                  handleOptionSelect(currentQuestion.weights[optionIndex])
                }
              />
              <Text>{option}</Text>
            </View>
          ))}
        </View>
      )}
      {!isLastQuestion ? (
        <Button title="Next" onPress={handleNext} color="#6200EE" />
      ) : (
        <Button title="Submit" onPress={handleSubmit} color="#6200EE" />
      )}
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
  messageText: {
    fontSize: 18,
    color: "#FF6347", // Red color for the message
    textAlign: "center",
    marginTop: 20,
  },
});

export default QuestionsScreen;
