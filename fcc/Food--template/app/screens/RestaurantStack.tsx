import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import RestaurantListScreen from "../screens/RestaurantListScreen";
import MenuScreen from "../screens/MenuScreen";
import MainLayout from "../components/MainLayout";

const Stack = createNativeStackNavigator();

export default function RestaurantsStack({ navigation, route }: any) {
  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    // Always show footer (BottomTabs) on both screens
    navigation.setOptions({
      tabBarStyle: { display: "flex" },
    });
  }, [navigation, route]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Restaurant List has header and footer */}
      <Stack.Screen name="RestaurantList">
        {() => (
          <MainLayout navigation={navigation}>
            <RestaurantListScreen navigation={navigation} />
          </MainLayout>
        )}
      </Stack.Screen>

      {/* Menu also has header/footer via MainLayout */}
      <Stack.Screen name="Menu">
        {({ route }) => (
          <MainLayout navigation={navigation}>
            <MenuScreen route={route} navigation={navigation} />
          </MainLayout>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
