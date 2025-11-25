import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import AccountSelectionScreen from "../screens/AccountSelectionScreen";
import LoginScreen from "../screens/LoginScreen";
import BottomTabs from "../components/BottomTabs"; // Tab navigator

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Login"
      >
        {/* Login screen */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Account selection for users with both accounts */}
        <Stack.Screen
          name="AccountSelection"
          component={AccountSelectionScreen}
        />

        {/* Main app after login */}
        <Stack.Screen name="MainTabs" component={BottomTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export type RootStackParamList = {
  Login: undefined;
  AccountSelection: undefined;
  MainTabs: { userType?: "customer" | "courier" };
};
