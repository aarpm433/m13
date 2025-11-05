import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Button, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type OrderItem = {
  id: string;
  name: string;
  qty: number;
  price: number;
};

type Props = {
  route: { params: { orderItems: OrderItem[] } };
  navigation: any;
};

export default function OrderConfirmationScreen({ route, navigation }: Props) {
  const { orderItems } = route.params;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<null | boolean>(null);

  const totalAmount = orderItems.reduce((sum, item) => sum + item.qty * item.price, 0);

  const handleConfirmOrder = () => {
    setLoading(true);
    setSuccess(null);

    // Simulate API call
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% chance success for demo
      setSuccess(isSuccess);
      setLoading(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Confirmation</Text>

      <FlatList
        data={orderItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text>{item.name} × {item.qty}</Text>
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
          <Text style={styles.failureText}>Order Failed. Please try again.</Text>
          <Button title="Confirm Order" onPress={handleConfirmOrder} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
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
