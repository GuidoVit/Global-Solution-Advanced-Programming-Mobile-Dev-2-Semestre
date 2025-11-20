import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CompetenciesScreen from "./screens/CompetenciesScreen";
import CompetencyDetailScreen from "./screens/CompetencyDetailScreen";
import AddSessionScreen from "./screens/AddSessionScreen";

export type SessionType = {
  id: string;
  sessionNumber: number;
  title: string;
  content: string;
  progress: number;
  notes: string;
  date: string;
};

export type CompetencyType = {
  id: string;
  name: string;
  sessions: SessionType[];
};

export type RootStackParamList = {
  Competencies: undefined;
  CompetencyDetail: {
    competency: CompetencyType;
    updateCompetencies: (list: CompetencyType[]) => void;
  };
  AddSession: {
    competency: CompetencyType;
    updateCompetencies: (list: CompetencyType[]) => void;
    session?: SessionType;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Competencies">
        <Stack.Screen
          name="Competencies"
          component={CompetenciesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CompetencyDetail"
          component={CompetencyDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddSession"
          component={AddSessionScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
