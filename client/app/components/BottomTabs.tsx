import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RestaurantsStack from "../screens/RestaurantStack";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";
import CourierDeliveriesScreen from "../screens/CourierDelivery";
import CourierAccountScreen from "../screens/AccountDetailsScreen";

const Tab = createBottomTabNavigator();

// --- CUSTOMER TABS ---
function CustomerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#DA583B",
        tabBarInactiveTintColor: "#999",
      }}
    >
      <Tab.Screen
        name="Restaurants"
        component={RestaurantsStack}
        options={{
          title: "Restaurants",
          tabBarLabel: "Restaurants",
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderHistoryScreen}
        options={{
          title: "Orders",
          tabBarLabel: "Orders",
        }}
      />
      <Tab.Screen
        name="CustomerAccount"
        component={CourierAccountScreen}
        options={{
          title: "Account",
          tabBarLabel: "Account",
        }}
        initialParams={{ accountType: "customer" }}
      />
    </Tab.Navigator>
  );
}

// --- COURIER TABS ---
function CourierTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#DA583B",
        tabBarInactiveTintColor: "#999",
      }}
    >
      <Tab.Screen
        name="Deliveries"
        component={CourierDeliveriesScreen}
        options={{
          title: "Deliveries",
          tabBarLabel: "Deliveries",
        }}
      />
      <Tab.Screen
        name="CourierAccount"
        component={CourierAccountScreen}
        options={{
          title: "Account",
          tabBarLabel: "Account",
        }}
        initialParams={{ accountType: "courier" }}
      />
    </Tab.Navigator>
  );
}

export default function BottomTabs({ navigation, route }: any) {
  const userType = route?.params?.userType;

  const handleLogout = () => {
    navigation.replace("Login");
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Unified Header */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/support_materials_13/Images/AppLogoV1.png")}
          style={styles.logo}
        />
        <View style={styles.headerCenter}>
          <Text style={styles.accountLabel}>
            {userType === "courier" ? "Courier Account" : "Customer Account"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Render appropriate tabs based on userType */}
      <View style={{ flex: 1 }}>
        {userType === "courier" ? <CourierTabs /> : <CustomerTabs />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: "contain",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  accountLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#DA583B",
  },
  logoutButton: {
    backgroundColor: "#DA583B",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});