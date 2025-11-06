import React from "react";
import { SafeAreaView, View, StyleSheet, useWindowDimensions } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator"; // Import the type for navigation params
interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // type-safe now
  const { width } = useWindowDimensions();
  const footerHeight = Math.max(56, Math.round(width * 0.11));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.content, { paddingBottom: footerHeight }]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1 },
});
