import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MenuScreen({ route, navigation }: any) {
  const { restaurant } = route.params;

  const initialMenu = [
    { id: "1", name: "Margherita Pizza", price: 12 },
    { id: "2", name: "Pepperoni Pizza", price: 14 },
    { id: "3", name: "Caesar Salad", price: 9 },
    { id: "4", name: "Garlic Bread", price: 6 },
  ];

  const [menu, setMenu] = useState(
    initialMenu.map((item) => ({ ...item, qty: 0 }))
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<null | boolean>(null);

  useEffect(() => {
    setMenu(initialMenu.map((item) => ({ ...item, qty: 0 })));
  }, [restaurant]);

  const increaseQty = (id: string) => {
    setMenu((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id: string) => {
    setMenu((prev) =>
      prev.map((item) =>
        item.id === id && item.qty > 0 ? { ...item, qty: item.qty - 1 } : item
      )
    );
  };

  const totalQty = menu.reduce((sum, item) => sum + item.qty, 0);
  const createOrderDisabled = totalQty === 0;

  const handleConfirmOrder = () => {
    setLoading(true);
    setSuccess(null);

    setTimeout(() => {
      const isSuccess = Math.random() > 0.3;
      setSuccess(isSuccess);
      setLoading(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#ff5733" />
      </TouchableOpacity>

      <Text style={styles.title}>{restaurant.name} Menu</Text>

      {/* Menu Items */}
      {menu.map((item) => (
        <View key={item.id} style={styles.menuItem}>
          <Image
            source={require("../../assets/support_materials_13/Images/RestaurantMenu.jpg")}
            style={styles.itemImage}
          />

          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
          </View>

          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => decreaseQty(item.id)}>
              <Ionicons name="remove-circle-outline" size={28} color="#333" />
            </TouchableOpacity>

            <Text style={styles.qtyText}>{item.qty}</Text>

            <TouchableOpacity onPress={() => increaseQty(item.id)}>
              <Ionicons name="add-circle-outline" size={28} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={[
          styles.orderButton,
          createOrderDisabled && { backgroundColor: "#ccc" },
        ]}
        disabled={createOrderDisabled}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.orderText}>Create Order</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
          setSuccess(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Confirm Your Order</Text>

            {menu
              .filter((item) => item.qty > 0)
              .map((item) => (
                <Text key={item.id}>
                  {item.name} × {item.qty} = $
                  {(item.price * item.qty).toFixed(2)}
                </Text>
              ))}

            <Text style={styles.total}>
              Total: $
              {menu
                .filter((item) => item.qty > 0)
                .reduce((sum, item) => sum + item.qty * item.price, 0)
                .toFixed(2)}
            </Text>

            {loading && <ActivityIndicator size="large" color="#ff5733" />}

            {!loading && success === null && (
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmOrder}
              >
                <Text style={styles.confirmText}>Confirm Order</Text>
              </TouchableOpacity>
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
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirmOrder}
                >
                  <Text style={styles.confirmText}>Confirm Order</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setModalVisible(false);
                setSuccess(null);
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingBottom: 80, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },

  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },

  itemDetails: {
    flex: 1,
    justifyContent: "center",
  },

  itemName: { fontSize: 18, fontWeight: "600" },
  itemPrice: { fontSize: 14, color: "#777" },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  qtyText: { fontSize: 18, marginHorizontal: 10 },
  orderButton: {
    backgroundColor: "#ff5733",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  orderText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

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
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  total: { fontWeight: "bold", marginTop: 10, marginBottom: 15 },
  confirmButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 5,
  },
  confirmText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  cancelText: { fontSize: 16, fontWeight: "bold" },
  statusContainer: { alignItems: "center", marginTop: 15 },
  successText: { color: "green", fontSize: 18, marginTop: 10 },
  failureText: { color: "red", fontSize: 18, marginTop: 10, marginBottom: 5 },
});
