import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import BottomTabs from "../components/BottomTabs";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Login screen */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Main app with bottom tabs */}
        <Stack.Screen name="Main" component={BottomTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export type RootStackParamList = {
  Login: undefined;
  RestaurantList: undefined;
  Menu: {
    restaurant: {
      id: string;
      name: string;
      rating: number;
      price: string;
    }
  };
  Orders: undefined;
  OrderConfirmation: undefined;
};
