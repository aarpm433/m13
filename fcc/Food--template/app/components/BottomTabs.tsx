import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RestaurantListScreen from "../screens/RestaurantListScreen";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";
import { Ionicons } from "@expo/vector-icons";
import MainLayout from "./MainLayout";
import MenuScreen from "../screens/MenuScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs({ navigation }: any) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ff5733",
        tabBarInactiveTintColor: "#555",
      }}
    >
      <Tab.Screen
        name="Restaurants"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant" size={size} color={color} />
          ),
        }}
      >
        {() => (
          <MainLayout navigation={navigation}>
            <RestaurantListScreen />
          </MainLayout>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="OrderHistory"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      >
        {() => (
          <MainLayout navigation={navigation}>
            <OrderHistoryScreen />
          </MainLayout>
        )}
      </Tab.Screen>
      <Tab.Screen name="Menu" component={MenuScreen} options={{ tabBarButton: () => null }} />

    </Tab.Navigator>
  );
}
