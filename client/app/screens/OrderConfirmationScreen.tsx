import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

type OrderItem = {
  id: string;
  name: string;
  qty: number;
  price: number;
};

type Props = {
  route: { params: { orderItems: OrderItem[]; restaurantName: string } };
  navigation: any;
};

export default function OrderConfirmationScreen({ route, navigation }: Props) {
  const { orderItems, restaurantName } = route.params;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<null | boolean>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const [sendSMS, setSendSMS] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const NGROK_URL = process.env.EXPO_PUBLIC_NGROK_URL;


  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  const handleConfirmOrder = async () => {
    setModalVisible(true); // Open modal for email/SMS options
  };

  const handleSendOrder = async () => {
    setLoading(true);
    setSuccess(null);
    setModalVisible(false);

    try {
      const token = await AsyncStorage.getItem("userToken");

      const response = await fetch(`http://localhost:8080/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems,
          total: totalAmount,
          restaurantName,
          sendEmail: sendEmail ? emailAddress : null,
          sendSMS: sendSMS ? phoneNumber : null,
        }),
      });

      if (!response.ok) throw new Error("Order failed");

      setSuccess(true);
    } catch (error) {
      console.error("❌ Error placing order:", error);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Confirmation</Text>
      <Text style={styles.restaurant}>Restaurant: {restaurantName}</Text>

      <FlatList
        data={orderItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text>
              {item.name} × {item.qty}
            </Text>
            <Text>${(item.price * item.qty).toFixed(2)}</Text>
          </View>
        )}
      />

      <Text style={styles.total}>Total: ${totalAmount.toFixed(2)}</Text>

      {success === null && !loading && (
        <Button title="Confirm Order" onPress={handleConfirmOrder} />
      )}

      {loading && (
        <Button title="Processing Order..." disabled onPress={() => {}} />
      )}

      {success === true && (
        <View style={styles.statusContainer}>
          <Ionicons name="checkmark-circle" size={50} color="green" />
          <Text style={styles.successText}>Order Confirmed!</Text>
        </View>
      )}

      {success === false && (
        <View style={styles.statusContainer}>
          <Ionicons name="close-circle" size={50} color="red" />
          <Text style={styles.failureText}>
            Order Failed. Please try again.
          </Text>
          <Button title="Confirm Order" onPress={handleConfirmOrder} />
        </View>
      )}

      {/* Modal for email/SMS confirmation */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Receive your order confirmation
            </Text>
            <Text style={styles.modalSubtitle}>
              Would you like to receive your order confirmation by email and/or
              text?
            </Text>

            {/* Email option */}
            <View style={styles.optionRow}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setSendEmail(!sendEmail)}
              >
                {sendEmail && <Ionicons name="checkmark" size={20} color="#fff" />}
              </TouchableOpacity>
              <TextInput
                placeholder="Enter email"
                value={emailAddress}
                onChangeText={setEmailAddress}
                style={styles.input}
                editable={sendEmail}
              />
            </View>

            {/* SMS option */}
            <View style={styles.optionRow}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setSendSMS(!sendSMS)}
              >
                {sendSMS && <Ionicons name="checkmark" size={20} color="#fff" />}
              </TouchableOpacity>
              <TextInput
                placeholder="Enter phone number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                style={styles.input}
                editable={sendSMS}
              />
            </View>

            <Button title="Send Order" onPress={handleSendOrder} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  restaurant: { fontSize: 18, marginBottom: 20 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  total: { fontSize: 18, fontWeight: "bold", marginTop: 10, marginBottom: 20 },
  statusContainer: { alignItems: "center", marginTop: 20 },
  successText: { color: "green", fontSize: 18, marginTop: 10 },
  failureText: { color: "red", fontSize: 18, marginTop: 10, marginBottom: 10 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  modalSubtitle: { fontSize: 16, marginBottom: 20 },
  optionRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: "#DA583B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
});
