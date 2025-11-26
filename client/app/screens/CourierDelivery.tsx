import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
  RefreshControl,
} from "react-native";

const NGROK_URL = process.env.EXPO_PUBLIC_NGROK_URL;

const STATUS_COLORS = {
  PENDING: "#FF6B6B",
  IN_PROGRESS: "#FFA500",
  DELIVERED: "#4CAF50",
};

const STATUS_ORDER = ["PENDING", "IN_PROGRESS", "DELIVERED"];

export default function CourierDeliveriesScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data || []);
      } else {
        Alert.alert("Error", "Failed to fetch orders.");
      }
    } catch (error) {
      Alert.alert("Connection Error", "Cannot reach the server.");
    }
  };

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      await fetchOrders();
      setLoading(false);
    };
    loadOrders();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  // Update order status
  const updateOrderStatus = async (orderId: number) => {
    try {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;

      const currentIndex = STATUS_ORDER.indexOf(order.status);
      if (currentIndex === STATUS_ORDER.length - 1) {
        Alert.alert("Done", "Order already delivered.");
        return;
      }

      const nextStatus = STATUS_ORDER[currentIndex + 1];

      const response = await fetch(`${NGROK_URL}/api/order/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (response.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: nextStatus } : o
          )
        );

        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: nextStatus });
        }
      } else {
        Alert.alert("Error", "Cannot update status.");
      }
    } catch (err) {
      Alert.alert("Error", "Cannot reach server.");
    }
  };

  const openOrderDetail = (order: any) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const renderTableRow = ({ item }: any) => {
    const STATUS_COLORS: Record<string, string> = {
    pending: "#FFA500",
    accepted: "#4CAF50",
    preparing: "#2196F3",
    delivering: "#9C27B0",
    completed: "#2ECC71",
    cancelled: "#E74C3C",
  };
  const statusColor =
  STATUS_COLORS[item.status as keyof typeof STATUS_COLORS] ?? "#999";


    return (
      <View style={styles.row}>
        <Text style={[styles.cell, styles.idCell]}>#{item.id}</Text>

        <Text style={[styles.cell, styles.addressCell]}>
          {item.delivery_address}
        </Text>

        <TouchableOpacity
          style={[
            styles.statusButton,
            { backgroundColor: statusColor },
          ]}
          onPress={() => updateOrderStatus(item.id)}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => openOrderDetail(item)}
        >
          <Text style={styles.viewText}>View</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#DA583B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* TABLE HEADER */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.idCell]}>ID</Text>
        <Text style={[styles.headerCell, styles.addressCell]}>Address</Text>
        <Text style={[styles.headerCell, styles.statusHeader]}>Progress</Text>
        <Text style={[styles.headerCell, styles.viewHeader]}>Info</Text>
      </View>

      {/* TABLE DATA */}
      <FlatList
        data={orders}
        renderItem={renderTableRow}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No deliveries</Text>
          </View>
        }
      />

      {/* DETAIL MODAL */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeText}>Close ✕</Text>
          </TouchableOpacity>

          <ScrollView style={styles.modalContent}>
            {selectedOrder && (
              <>
                <Text style={styles.modalTitle}>Order #{selectedOrder.id}</Text>

                <Text style={styles.label}>Restaurant</Text>
                <Text style={styles.value}>
                  {selectedOrder.restaurant_name || "N/A"}
                </Text>

                <Text style={styles.label}>Delivery Address</Text>
                <Text style={styles.value}>{selectedOrder.delivery_address}</Text>

                <Text style={styles.label}>Order Date</Text>
                <Text style={styles.value}>{selectedOrder.date || "Unknown"}</Text>

                <Text style={styles.label}>Details</Text>
                <Text style={styles.value}>
                  {selectedOrder.items || "No items"}
                </Text>

                <Text style={styles.label}>Status</Text>
                <Text
                  style={[
                    styles.value,
                    { color: STATUS_COLORS[selectedOrder.status as keyof typeof STATUS_COLORS] ?? "#999" },
                  ]}
                >
                  {selectedOrder.status}
                </Text>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },

  tableHeader: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f3f3f3",
  },

  headerCell: { fontWeight: "bold", color: "#444", fontSize: 13 },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },

  cell: { fontSize: 13, color: "#333" },

  idCell: { width: 50 },
  addressCell: { flex: 1 },
  statusHeader: { width: 100, textAlign: "center" },
  viewHeader: { width: 65 },

  statusButton: {
    width: 100,
    paddingVertical: 6,
    borderRadius: 5,
    alignItems: "center",
  },
  statusText: { color: "#fff", fontWeight: "600", fontSize: 12 },

  centerContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
},


  viewButton: {
    width: 60,
    paddingVertical: 6,
    borderRadius: 5,
    backgroundColor: "#DA583B",
    alignItems: "center",
  },
  viewText: { color: "#fff", fontSize: 12, fontWeight: "600" },

  emptyContainer: { padding: 20, alignItems: "center" },
  emptyText: { color: "#999" },

  modalContainer: { flex: 1, backgroundColor: "#fff" },
  closeButton: { padding: 15 },
  closeText: { color: "#DA583B", fontWeight: "700", fontSize: 16 },
  modalContent: { padding: 20 },

  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  label: { color: "#999", marginTop: 20, fontSize: 13, fontWeight: "600" },
  value: { color: "#333", fontSize: 15, marginTop: 5 },
});
