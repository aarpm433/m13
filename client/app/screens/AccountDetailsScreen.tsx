import React, { useEffect, useState } from "react";
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

export default function AccountDetailsScreen({ route }: any) {
  const accountType = route?.params?.accountType ?? "customer";
  const typeLabel = accountType === "courier" ? "Courier" : "Customer";

  const [primaryEmail, setPrimaryEmail] = useState("");
  const [typeEmail, setTypeEmail] = useState("");
  const [typePhone, setTypePhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // -----------------------
  // FETCH ACCOUNT DETAILS
  // -----------------------
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const userID = await AsyncStorage.getItem("userID");
        if (!userID) return;

        const url = `http://localhost:8080/api/account/${userID}?type=${accountType}`;
        const res = await fetch(url);

        if (!res.ok) {
          Alert.alert("Error", "Failed to load account info.");
          setLoading(false);
          return;
        }

        const data = await res.json();

        // Map fields based on role
        setPrimaryEmail(data.primaryEmail ?? "");

        if (accountType === "courier") {
          setTypeEmail(data.courierEmail ?? "");
          setTypePhone(data.courierPhone ?? "");
        } else {
          setTypeEmail(data.customerEmail ?? "");
          setTypePhone(data.customerPhone ?? "");
        }
      } catch (err) {
        Alert.alert("Connection Error", "Cannot reach server.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [accountType]);

  // -----------------------
  // SAVE ACCOUNT DETAILS
  // -----------------------
  const updateDetails = async () => {
    setSaving(true);
    try {
      const userID = await AsyncStorage.getItem("userID");
      if (!userID) return;

      // Role-specific payload
      const body =
        accountType === "courier"
          ? { courierEmail: typeEmail, courierPhone: typePhone }
          : { customerEmail: typeEmail, customerPhone: typePhone };

      const res = await fetch(
        `http://localhost:8080/api/account/${userID}?type=${accountType}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        Alert.alert("Error", "Failed to update details.");
        return;
      }

      Alert.alert("Success", "Account updated.");
    } catch (err) {
      Alert.alert("Error", "Unable to update details.");
    } finally {
      setSaving(false);
    }
  };

  // -----------------------
  // LOADING STATE
  // -----------------------
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#DA583B" />
      </View>
    );
  }

  // -----------------------
  // UI
  // -----------------------
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{typeLabel} Account Details</Text>

      {/* Read-only primary email */}
      <View style={styles.section}>
        <Text style={styles.label}>User Email (read-only)</Text>
        <View style={styles.readOnlyInput}>
          <Text>{primaryEmail}</Text>
        </View>
      </View>

      {/* Editable type email */}
      <View style={styles.section}>
        <Text style={styles.label}>{typeLabel} Email</Text>
        <TextInput
          style={styles.input}
          value={typeEmail}
          onChangeText={setTypeEmail}
        />
      </View>

      {/* Editable type phone */}
      <View style={styles.section}>
        <Text style={styles.label}>{typeLabel} Phone</Text>
        <TextInput
          style={styles.input}
          value={typePhone}
          onChangeText={setTypePhone}
        />
      </View>

      {/* Save button */}
      <View style={styles.buttonContainer}>
        <Button
          title={saving ? "Saving..." : "Save Changes"}
          onPress={updateDetails}
          color="#DA583B"
          disabled={saving}
        />
      </View>
    </ScrollView>
  );
}

// -----------------------
// STYLES
// -----------------------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  section: { marginBottom: 20 },
  label: { marginBottom: 6, fontWeight: "600", color: "#666" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  readOnlyInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  buttonContainer: { marginTop: 20, marginBottom: 40 },
});
