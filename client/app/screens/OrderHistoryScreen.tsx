import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:8080/api/orders");

        if (!response.ok) throw new Error("Failed to fetch orders");

        const data = await response.json();
        setOrders(data);
      } catch (err: any) {
        console.error("❌ Failed to load orders:", err);
        setError("Unable to load your orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>

      {loading && <ActivityIndicator size="large" color="#ff5733" />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {!loading && !error && orders.length === 0 && (
        <Text style={styles.emptyText}>No past orders yet.</Text>
      )}

      {!loading && !error && orders.length > 0 && (
        <>
          {/* Table Headers */}
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.headerText]}>Order</Text>
            <Text style={[styles.cell, styles.headerText]}>Status</Text>
            <Text style={[styles.cell, styles.headerText]}>View</Text>
          </View>

          {/* Table Rows */}
          {orders.map((order) => (
            <View key={order.id} style={styles.tableRow}>
              <Text style={styles.cell}>#{order.id}</Text>
              <Text style={[styles.cell, styles.status]}>{order.status}</Text>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => setSelectedOrder(order)}
              >
                <Ionicons name="eye-outline" size={22} color="#ff5733" />
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}

      {/* Modal for Order Details */}
      <Modal
        visible={!!selectedOrder}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedOrder(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Order Details</Text>
            {selectedOrder && (
              <>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Order ID:</Text> #{selectedOrder.id}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Status:</Text> {selectedOrder.status}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Items:</Text>{" "}
                  {selectedOrder.items?.length ?? 0}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Total:</Text> $
                  {selectedOrder.total?.toFixed(2) ?? "0.00"}
                </Text>
              </>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedOrder(null)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  errorText: { color: "red", textAlign: "center", marginVertical: 10 },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 8,
  },
  cell: { flex: 1, textAlign: "center", fontSize: 16 },
  headerText: { fontWeight: "bold", color: "#333" },
  status: { color: "#555" },
  viewButton: { flex: 1, alignItems: "center" },
  emptyText: { textAlign: "center", marginTop: 20, color: "#777" },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  modalText: { fontSize: 16, marginBottom: 8 },
  bold: { fontWeight: "bold" },
  closeButton: {
    backgroundColor: "#ff5733",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
  },
  closeText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
