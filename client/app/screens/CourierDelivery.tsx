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
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  // Fetch all orders (courier sees orders assigned to them)
  const fetchOrders = async () => {
    try {
      const response = await fetch(`${NGROK_URL}/api/orders`, {
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
      console.error("Fetch error:", error);
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

  // Handle pull-to-refresh
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

      const currentStatusIndex = STATUS_ORDER.indexOf(order.status);
      if (currentStatusIndex === STATUS_ORDER.length - 1) {
        Alert.alert("Status Update", "Order is already delivered.");
        return;
      }

      const nextStatus = STATUS_ORDER[currentStatusIndex + 1];

      const response = await fetch(`${NGROK_URL}/api/order/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (response.ok) {
        // Update local state
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: nextStatus } : o
          )
        );

        // Update modal if it's open
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: nextStatus });
        }

        Alert.alert("Success", `Order status updated to ${nextStatus}`);
      } else {
        Alert.alert("Error", "Failed to update order status.");
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Connection Error", "Cannot reach the server.");
    }
  };

  // Open detail modal
  const openOrderDetail = (order: any) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const renderOrderItem = ({ item }: any) => {
    const isDelivered = item.status === "DELIVERED";
    const statusColor = STATUS_COLORS[item.status as keyof typeof STATUS_COLORS];

    return (
      <View style={styles.deliveryCard}>
        <View style={styles.deliveryRow}>
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryId}>Order #{item.id}</Text>
            <Text style={styles.deliveryCustomer}>{item.customer_name}</Text>
            <Text style={styles.deliveryAddress}>{item.delivery_address}</Text>
          </View>
        </View>

        <View style={styles.deliveryActions}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              { backgroundColor: statusColor, opacity: isDelivered ? 0.6 : 1 },
            ]}
            onPress={() => updateOrderStatus(item.id)}
            disabled={isDelivered}
            activeOpacity={isDelivered ? 1 : 0.7}
          >
            <Text style={styles.statusButtonText}>{item.status}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => openOrderDetail(item)}
          >
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
        </View>
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
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#DA583B"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders yet</Text>
          </View>
        }
      />

      {/* Order Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>✕ Close</Text>
          </TouchableOpacity>

          <ScrollView style={styles.modalContent}>
            {selectedOrder && (
              <>
                <Text style={styles.modalTitle}>Order Details</Text>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Order ID:</Text>
                  <Text style={styles.detailValue}>#{selectedOrder.id}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Customer Name:</Text>
                  <Text style={styles.detailValue}>
                    {selectedOrder.customer_name}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Customer Email:</Text>
                  <Text style={styles.detailValue}>
                    {selectedOrder.customer_email}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Delivery Address:</Text>
                  <Text style={styles.detailValue}>
                    {selectedOrder.delivery_address}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      {
                        color:
                          STATUS_COLORS[
                            selectedOrder.status as keyof typeof STATUS_COLORS
                          ],
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    {selectedOrder.status}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Items:</Text>
                  <Text style={styles.detailValue}>
                    {selectedOrder.items || "N/A"}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Restaurant:</Text>
                  <Text style={styles.detailValue}>
                    {selectedOrder.restaurant_name || "N/A"}
                  </Text>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContent: { padding: 12 },
  deliveryCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deliveryRow: { marginBottom: 12 },
  deliveryInfo: {},
  deliveryId: { fontSize: 16, fontWeight: "bold", color: "#333" },
  deliveryCustomer: { fontSize: 14, color: "#666", marginTop: 4 },
  deliveryAddress: { fontSize: 12, color: "#999", marginTop: 2 },
  deliveryActions: { flexDirection: "row", gap: 8 },
  statusButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statusButtonText: { color: "#fff", fontWeight: "600", fontSize: 12 },
  viewButton: {
    backgroundColor: "#DA583B",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  viewButtonText: { color: "#fff", fontWeight: "600", fontSize: 12 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#999" },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 12,
  },
  closeButton: { paddingHorizontal: 16, paddingVertical: 12 },
  closeButtonText: { color: "#DA583B", fontWeight: "600", fontSize: 16 },
  modalContent: { flex: 1, padding: 16 },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  detailSection: { marginBottom: 16 },
  detailLabel: { fontSize: 12, color: "#999", fontWeight: "600" },
  detailValue: { fontSize: 14, color: "#333", marginTop: 4 },
});