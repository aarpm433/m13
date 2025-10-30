import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function Header({ navigation }: any) {
  return (
    <View style={styles.header}>
      <Image
        source={require("../../assets/support_materials_13/Images/AppLogoV1.png")}
        style={styles.logo}
      />
      <TouchableOpacity onPress={() => navigation.replace("Login")}>
        <Text style={styles.logout}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "#ff5733",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  logo: { width: 120, height: 40, resizeMode: "contain" },
  logout: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
