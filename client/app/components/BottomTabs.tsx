import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import RestaurantsStack from "../screens/RestaurantStack";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#DA583B",
        tabBarInactiveTintColor: "#555",
      }}
    >
      <Tab.Screen
        name="Restaurants"
        component={RestaurantsStack}
        options={{
          tabBarLabel: "Restaurants",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="OrderHistory"
        component={OrderHistoryScreen} // MainLayout inside screen
        options={{
          tabBarLabel: "Orders",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
