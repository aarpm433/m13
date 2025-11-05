import React from "react";
import { SafeAreaView, View, StyleSheet, useWindowDimensions } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const navigation = useNavigation<NavigationProp<any>>(); // gives access to navigation
  const { width } = useWindowDimensions();
  const footerHeight = Math.max(56, Math.round(width * 0.11));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.content, { paddingBottom: footerHeight }]}>
        {children}
      </View>
      {/* Example: you can now use navigation inside MainLayout */}
      {/* <Button title="Go Back" onPress={() => navigation.goBack()} /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1 },
});
