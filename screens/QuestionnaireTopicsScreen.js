import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../Context/AuthContext";
import questionnaire from "../data/questionnaireData.json"; // Import updated JSON data

const TopicsScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext); // Access user data
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    // Fetch topics for the department
    if (user && user.department) {
      const departmentTopics = questionnaire[user.department]; // Access topics for the user's department

      if (departmentTopics) {
        const topicNames = Object.keys(departmentTopics); // Get the keys (topics) from the department
        setTopics(topicNames || []); // Set topics as an array of topic names
      } else {
        setError("No topics found for your department.");
      }
    } else {
      setError("User data is not available.");
    }
    setIsLoading(false); // End loading when topics are fetched or if error occurs
  }, [user]);

  const handleTopicPress = (topic) => {
    // Navigate to the Questions screen with the selected topic
    navigation.navigate("QuestionsScreen", { topic });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Topics for {user?.department || "your department"}
      </Text>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={topics}
          keyExtractor={(item) => item} // Use item as the key, assuming topic names are unique
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.topicCard}
              onPress={() => handleTopicPress(item)}
            >
              <Text style={styles.topicTitle}>{item}</Text>
            </TouchableOpacity>
          )}
        />
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
    elevation: 2,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

export default TopicsScreen;
