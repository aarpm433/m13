import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Text,
  ActivityIndicator,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation, route }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // --- NEW: Read userType from route params (set by AccountSelection) ---
  const routeUserType = route?.params?.userType;

  const NGROK_URL = process.env.EXPO_PUBLIC_NGROK_URL;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Login Failed", "Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/api/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await AsyncStorage.setItem("userID", String(data.user_id));

        const { customer_id, courier_id } = data;

        // --- UPDATED: If routeUserType is set (from AccountSelection), use it ---
        if (routeUserType) {
          navigation.replace("MainTabs", { userType: routeUserType });
        } else if (customer_id && courier_id) {
          // --- User has both accounts, go to selection screen ---
          navigation.replace("AccountSelection");
        } else if (customer_id) {
          navigation.replace("MainTabs", { userType: "customer" });
        } else if (courier_id) {
          navigation.replace("MainTabs", { userType: "courier" });
        } else {
          Alert.alert(
            "Login Error",
            "No customer or courier account associated with this user."
          );
        }
        return;
      }

      if (response.status === 401) {
        Alert.alert("Login Failed", "Invalid email or password.");
        return;
      }

      Alert.alert("Login Failed", data?.message || "Unexpected error occurred.");
    } catch (error) {
      console.error("🚫 Network Error:", error);
      Alert.alert(
        "Connection Error",
        "Cannot reach the server. Please check your NGROK URL or backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/support_materials_13/Images/AppLogoV2.png")}
        style={{ alignSelf: "center", marginBottom: 20 }}
      />

      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to Begin</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#DA583B" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 30, color: "#555" },
});