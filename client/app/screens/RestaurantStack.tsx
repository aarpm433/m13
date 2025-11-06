import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import RestaurantListScreen from "../screens/RestaurantListScreen";
import MenuScreen from "../screens/MenuScreen";
import MainLayout from "../components/MainLayout";

const Stack = createNativeStackNavigator();

export default function RestaurantsStack({ navigation, route }: any) {
  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "RestaurantList";
    navigation.setOptions({
      tabBarStyle: { display: "flex" },
    });
  }, [navigation, route]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RestaurantList">
        {(props) => (
          <MainLayout>
            <RestaurantListScreen {...props} />
          </MainLayout>
        )}
      </Stack.Screen>

      <Stack.Screen name="Menu">
        {(props) => (
          <MainLayout>
            <MenuScreen {...props} />
          </MainLayout>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
