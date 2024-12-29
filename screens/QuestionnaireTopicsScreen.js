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
import { db } from "../firebase"; // Ensure the correct Firebase configuration path
import { collection, getDocs, doc } from "firebase/firestore";

const TopicsScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext); // Access user data
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const fetchTopics = async () => {
      if (user && user.department) {
        try {
          const departmentRef = doc(db, "Departments", user.department);
          const topicsCollectionRef = collection(departmentRef, "Topics");
          const snapshot = await getDocs(topicsCollectionRef);

          if (!snapshot.empty) {
            const fetchedTopics = snapshot.docs.map((doc) => doc.id);
            setTopics(fetchedTopics || []);
          } else {
            setError("No topics found for your department.");
          }
        } catch (err) {
          console.error("Error fetching topics:", err);
          setError("Failed to fetch topics. Please try again later.");
        }
      } else {
        setError("User data is not available.");
      }
      setIsLoading(false); // End loading when topics are fetched or if error occurs
    };

    fetchTopics();
  }, [user]);

  const handleTopicPress = (topic) => {
    // Navigate to the Questions screen with the selected topic
    navigation.navigate("QuestionsScreen", { topic });
  };

  const handleDashboardPress = () => {
    // Navigate to the Dashboard page
    navigation.navigate("Dashboard");
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
          keyExtractor={(item) => item} // Use topic name as the key
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
      {/* Bottom Button to Navigate to Dashboard */}
      <TouchableOpacity
        style={styles.dashboardButton}
        onPress={handleDashboardPress}
      >
        <Text style={styles.dashboardButtonText}>Go to Dashboard</Text>
      </TouchableOpacity>
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
  dashboardButton: {
    backgroundColor: "#007BFF",
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  dashboardButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TopicsScreen;
