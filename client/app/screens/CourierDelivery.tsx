import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Alert,
} from "react-native";

const NGROK_URL = "https://gary-nonimpressionable-imputedly.ngrok-free.dev";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#FF6B6B",
  IN_PROGRESS: "#FFA500",
  DELIVERED: "#4CAF50",
};

const STATUS_FLOW = ["PENDING", "IN_PROGRESS", "DELIVERED"];

export default function CourierDeliveriesScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // -------------------------
  // LOAD ORDERS
  // -------------------------
  const fetchOrders = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/orders`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(
        (data || []).map((o: any) => ({ ...o, status: o.status.toUpperCase() }))
      );
    } catch (err) {
      console.log("fetchOrders error", err);
      Alert.alert("Error", "Unable to load deliveries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // -------------------------
  // UPDATE STATUS
  // -------------------------
  const updateStatus = async (order: any) => {
    const currentIndex = STATUS_FLOW.indexOf(order.status);
    if (currentIndex === STATUS_FLOW.length - 1) {
      Alert.alert("Done", "Order is already delivered.");
      return;
    }
    const nextStatus = STATUS_FLOW[currentIndex + 1];
    setUpdatingStatus(true);

    try {
      const res = await fetch(`http://localhost:8080/api/orders/${order.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) throw new Error(`Failed to update status: ${res.status}`);

      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: nextStatus } : o))
      );

      if (selectedOrder?.id === order.id) {
        setSelectedOrder({ ...selectedOrder, status: nextStatus });
      }
    } catch (err) {
      console.log("Error updating status:", err);
      Alert.alert("Error", "Could not update delivery status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff5733" />
      </View>
    );
  }

  const renderRow = ({ item }: any) => {
    const color = STATUS_COLORS[item.status] ?? "#777";

    return (
      <View style={styles.row}>
        <Text style={[styles.cell, { flex: 0.5 }]}>#{item.id}</Text>
        <Text style={[styles.cell, { flex: 2 }]}>{item.customer_address}</Text>

        <TouchableOpacity
          style={[styles.statusButton, { backgroundColor: color }]}
          onPress={() => updateStatus(item)}
          disabled={item.status === "DELIVERED" || updatingStatus}
        >
          <Text style={styles.statusText}>{item.status.replace("_", " ")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => setSelectedOrder(item)}
        >
          <Text style={styles.viewText}>View</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, { flex: 0.5 }]}>ID</Text>
        <Text style={[styles.headerCell, { flex: 2 }]}>Address</Text>
        <Text style={[styles.headerCell, { flex: 1 }]}>Progress</Text>
        <Text style={[styles.headerCell, { flex: 0.8 }]}>Info</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(o) => o.id.toString()}
        renderItem={renderRow}
      />

      {/* Modal */}
      <Modal visible={!!selectedOrder} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedOrder(null)}
            >
              <Text style={{ fontSize: 20 }}>✕</Text>
            </TouchableOpacity>

            {selectedOrder && (
              <ScrollView>
                <Text style={styles.modalTitle}>
                  Restaurant: {selectedOrder.restaurant_name}
                </Text>
                <Text style={styles.modalText}>
                  Customer: {selectedOrder.customer_name}
                </Text>
                <Text style={styles.modalText}>
                  Address: {selectedOrder.customer_address}
                </Text>
                <Text style={styles.modalText}>
                  Total: ${selectedOrder.total_cost}
                </Text>

                <Text style={[styles.modalText, { fontWeight: "bold", marginTop: 10 }]}>
                  Items:
                </Text>
                {selectedOrder.products?.map((p: any) => (
                  <Text key={p.id} style={styles.modalText}>
                    {p.quantity} × {p.product_name} (${p.total_cost})
                  </Text>
                ))}

                <Text
                  style={[
                    styles.modalText,
                    { color: STATUS_COLORS[selectedOrder.status], fontWeight: "bold", marginTop: 10 },
                  ]}
                >
                  Status: {selectedOrder.status.replace("_", " ")}
                </Text>

                <TouchableOpacity
                  style={[styles.statusButton, { backgroundColor: STATUS_COLORS[selectedOrder.status] }]}
                  onPress={() => updateStatus(selectedOrder)}
                  disabled={selectedOrder.status === "DELIVERED" || updatingStatus}
                >
                  {updatingStatus ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.statusText}>Next Step</Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 10,
    marginBottom: 5,
  },
  headerCell: { fontWeight: "bold", fontSize: 14, color: "#444" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  cell: { fontSize: 14, color: "#333" },
  statusButton: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  statusText: { color: "#fff", fontWeight: "bold" },
  viewButton: {
    flex: 0.8,
    paddingVertical: 6,
    borderRadius: 5,
    backgroundColor: "#ff5733",
    alignItems: "center",
  },
  viewText: { color: "#fff", fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 16,
  },
  modalBox: {
    width: "100%",
    maxHeight: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  closeButton: { alignSelf: "flex-end" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  modalText: { fontSize: 16, marginBottom: 6 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
