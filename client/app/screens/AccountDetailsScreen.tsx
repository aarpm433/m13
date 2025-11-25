import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NGROK_URL = process.env.EXPO_PUBLIC_NGROK_URL;

export default function AccountDetailsScreen({ route }: any) {
  const accountType = route?.params?.accountType || "customer"; // "customer" or "courier"

  const [userEmail, setUserEmail] = useState("");
  const [typeEmail, setTypeEmail] = useState("");
  const [typePhone, setTypePhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch account details
  const fetchDetails = async () => {
    try {
      setLoading(true);
      const userID = await AsyncStorage.getItem("userID");

      const response = await fetch(`${NGROK_URL}/api/user/${userID}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setUserEmail(data.email || "");

        if (accountType === "courier") {
          setTypeEmail(data.courier_email || "");
          setTypePhone(data.courier_phone || "");
        } else {
          setTypeEmail(data.customer_email || "");
          setTypePhone(data.customer_phone || "");
        }
      } else {
        Alert.alert("Error", "Failed to fetch account details.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Connection Error", "Cannot reach the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [accountType]);

  // Update account details
  const updateDetails = async () => {
    try {
      if (!typeEmail || !typePhone) {
        Alert.alert("Validation", "Please fill in all fields.");
        return;
      }

      setSaving(true);
      const userID = await AsyncStorage.getItem("userID");

      const endpoint =
        accountType === "courier"
          ? `http://localhost:8081/api/user/${userID}/courier`
          : `http://localhost:8081/api/user/${userID}/customer`;

      const body =
        accountType === "courier"
          ? {
              courier_email: typeEmail,
              courier_phone: typePhone,
            }
          : {
              customer_email: typeEmail,
              customer_phone: typePhone,
            };

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        Alert.alert("Success", "Your details have been updated.");
      } else {
        Alert.alert("Error", "Failed to update details.");
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Connection Error", "Cannot reach the server.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#DA583B" />
      </View>
    );
  }

  const typeLabel =
    accountType === "courier" ? "Courier" : "Customer";

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{typeLabel} Account Details</Text>

      {/* User Email (Read-only) */}
      <View style={styles.section}>
        <Text style={styles.label}>User Email (Read-only)</Text>
        <View style={styles.readOnlyInput}>
          <Text style={styles.readOnlyText}>{userEmail}</Text>
        </View>
      </View>

      {/* Type-specific Email */}
      <View style={styles.section}>
        <Text style={styles.label}>{typeLabel} Email</Text>
        <TextInput
          style={styles.input}
          value={typeEmail}
          onChangeText={setTypeEmail}
          placeholder={`Enter ${typeLabel.toLowerCase()} email`}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Type-specific Phone */}
      <View style={styles.section}>
        <Text style={styles.label}>{typeLabel} Phone</Text>
        <TextInput
          style={styles.input}
          value={typePhone}
          onChangeText={setTypePhone}
          placeholder={`Enter ${typeLabel.toLowerCase()} phone`}
          keyboardType="phone-pad"
        />
      </View>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        {saving ? (
          <ActivityIndicator size="large" color="#DA583B" />
        ) : (
          <Button
            title="Save Changes"
            onPress={updateDetails}
            color="#DA583B"
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 30, color: "#333" },
  section: { marginBottom: 24 },
  label: { fontWeight: "600", marginBottom: 8, color: "#666", fontSize: 14 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  readOnlyInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  readOnlyText: { fontSize: 14, color: "#666" },
  buttonContainer: { marginTop: 20, marginBottom: 40 },
});