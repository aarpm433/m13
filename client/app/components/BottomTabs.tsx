import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RestaurantsStack from "../screens/RestaurantStack";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";
import { Ionicons } from "@expo/vector-icons";
import MainLayout from "./MainLayout";

const Tab = createBottomTabNavigator();

export default function BottomTabs({ navigation }: any) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#DA583B", // matches your orange theme
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
      component={OrderHistoryScreen}
      options={{
        tabBarLabel: "Orders",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="time" size={size} color={color} />
        ),
      }}
    />

        {({ navigation }) => (   // <-- get navigation here
          <MainLayout navigation={navigation}>
            <OrderHistoryScreen />
          </MainLayout>
        )}
      </Tab.Screen>

    </Tab.Navigator>
  );
}
