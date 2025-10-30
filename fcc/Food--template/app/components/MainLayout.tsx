// app/components/MainLayout.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import Header from "./Header";

export default function MainLayout({ children, navigation }: any) {
  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 }, // content fills remaining space
});
