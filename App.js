import React from "react";
import { AuthProvider } from "./Context/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CompanyLoginScreen from "./screens/CompanyLoginScreen";
import CompanyRegistrationScreen from "./screens/CompanyRegistrationScreen";
import EmployeeLoginScreen from "./screens/EmployeeLoginScreen";
import EmployeeRegistrationScreen from "./screens/EmployeeRegistrationScreen";
import QuestionnaireTopicsScreen from "./screens/QuestionnaireTopicsScreen";
import QuestionsScreen from "./screens/QuestionsScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="CompanyLoginScreen">
          <Stack.Screen
            name="CompanyLoginScreen"
            component={CompanyLoginScreen}
            options={{ title: "Company Login" }}
          />
          <Stack.Screen
            name="CompanyRegistrationScreen"
            component={CompanyRegistrationScreen}
            options={{ title: "Register Company" }}
          />
          <Stack.Screen
            name="EmployeeLoginScreen"
            component={EmployeeLoginScreen}
            options={{ title: "Employee Login" }}
          />
          <Stack.Screen
            name="EmployeeRegistrationScreen"
            component={EmployeeRegistrationScreen}
            options={{ title: "Register Employee" }}
          />
          <Stack.Screen
            name="QuestionnaireTopicsScreen"
            component={QuestionnaireTopicsScreen}
            options={{ title: "Topics" }}
          />
          <Stack.Screen
            name="QuestionsScreen"
            component={QuestionsScreen}
            options={{ title: "QuestionsScreen" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
