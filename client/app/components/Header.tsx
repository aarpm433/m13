import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function Header({ navigation }: any) {
  return (
    <View style={styles.header}>
      {/* <Image
        source={require("../../assets/support_materials_13/Images/AppLogoV1.png")}
        style={styles.logo}
      />
      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.replace("Login")}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity> */}
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
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: "contain",
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
    fontSize: 16,
  },
});
