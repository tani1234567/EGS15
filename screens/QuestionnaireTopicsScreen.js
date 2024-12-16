import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../Context/AuthContext";
import questionnaireData from "../data/questionnaireData.json"; // Import JSON file

const QuestionnaireScreen = () => {
  const { user } = useContext(AuthContext); // Get user data from context
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch questionnaire topics based on the employee's department
  const fetchQuestionnaireTopics = () => {
    if (user && user.department) {
      const department = user.department;

      // Filter topics from the JSON file for the current department
      const departmentTopics = questionnaireData.filter(
        (topic) => topic.department === department
      );

      setTopics(departmentTopics);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  // Run the fetch logic when user data is available
  useEffect(() => {
    fetchQuestionnaireTopics();
  }, [user]);

  // Render loading state or topics
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Questionnaire Topics</Text>

      {topics.length > 0 ? (
        <FlatList
          data={topics}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.topicCard}>
              <Text style={styles.topicTitle}>{item.title}</Text>
              <Text>{item.description}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No topics available for this department.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  topicCard: {
    padding: 16,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3, // for Android shadow
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default QuestionnaireScreen;
