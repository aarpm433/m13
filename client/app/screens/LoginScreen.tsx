import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet, Text, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const NGROK_URL = process.env.EXPO_PUBLIC_NGROK_URL;

const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("Login Failed", "Please enter email and password");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(`${NGROK_URL}/api/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json", // Ensure Spring returns JSON
      },
      body: JSON.stringify({ email, password }),
    });

    const text = await response.text();
    let data: any = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    if (response.ok) {
      console.log("Login successful:", data);

      if (data?.token) {
        await AsyncStorage.setItem("userToken", data.token);
      }

      navigation.replace("Main");
    } else if (response.status === 401) {
      Alert.alert("Login Failed", "Invalid email or password");
    } else {
      Alert.alert("Login Failed", data?.message || "Something went wrong");
    }
  } catch (error) {
    console.error(error);
    Alert.alert(
      "Error",
      "Unable to connect to server. Make sure the backend is running and your NGROK URL is correct."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rocket Food Delivery</Text>

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
  input: { borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
});
