import React from "react";
import { SafeAreaView, View, StyleSheet, useWindowDimensions } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import Header from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
}

export default function MainLayout({ children, hideHeader = false }: MainLayoutProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const footerHeight = 10; // Adjust if you have a footer

  return (
    <SafeAreaView style={styles.safe}>
      {!hideHeader && <Header navigation={navigation} />}
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