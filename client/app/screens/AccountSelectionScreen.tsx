import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function AccountSelectionScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/support_materials_13/Images/AppLogoV2.png")}
        style={styles.image}
      />

      <Text style={styles.title}>Select Account Type</Text>
      <Text style={styles.subtitle}>Choose how you want to continue</Text>

      {/* CUSTOMER */}
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.replace("MainTabs", { userType: "customer" })
        }
      >
        <Text style={styles.buttonText}>Login as Customer</Text>
      </TouchableOpacity>

      {/* COURIER */}
      <TouchableOpacity
        style={[styles.button, styles.courierButton]}
        onPress={() =>
          navigation.replace("MainTabs", { userType: "courier" })
        }
      >
        <Text style={styles.buttonText}>Login as Courier</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  image: {
    marginBottom: 30,
    alignSelf: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#DA583B",
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  courierButton: {
    backgroundColor: "#333",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
});