import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NGROK_URL = process.env.EXPO_PUBLIC_NGROK_URL;

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

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  const handleConfirmOrder = async () => {
    setLoading(true);
    setSuccess(null);

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
});
