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
  const footerHeight = Math.max(56, Math.round(width * 0.11));

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