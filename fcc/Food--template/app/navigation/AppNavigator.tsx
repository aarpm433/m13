import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import MenuScreen from "../screens/MenuScreen";
import BottomTabs from "../components/BottomTabs";
import MainLayout from "../components/MainLayout";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Login screen has NO header/footer */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* All other screens (with Header/Footer) */}
        <Stack.Screen name="Main" component={BottomTabs} />

        {/* Menu screen wrapped in MainLayout so header/footer appear */}
        <Stack.Screen name="Menu">
          {({ navigation, route }) => (
            <MainLayout navigation={navigation}>
              <MenuScreen navigation={navigation} route={route} />
            </MainLayout>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
