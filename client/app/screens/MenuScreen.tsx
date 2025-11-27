import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MenuScreen({ route, navigation }: any) {
  const { restaurant } = route.params;
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [success, setSuccess] = useState<null | boolean>(null);

  const [useEmail, setUseEmail] = useState(false);
  const [usePhone, setUsePhone] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [accountType, setAccountType] = useState<"customer" | "courier">("customer");

  const NGROK_URL = process.env.EXPO_PUBLIC_NGROK_URL;

  // -----------------------
  // FETCH MENU
  // -----------------------
  const fetchMenu = async () => {
    try {
      setLoading(true);
      const url = `http://localhost:8080/api/products?restaurant=${restaurant.id}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch menu");
      const result = await response.json();
      const data = Array.isArray(result) ? result : result.data;

      const menuItems = data.map((item: any) => ({
        id: String(item.id),
        name: item.name,
        price: item.cost ?? 10,
        qty: 0,
      }));
      setMenu(menuItems);
    } catch (err) {
      console.error("❌ Failed to load menu:", err);
      Alert.alert("Error", "Cannot load menu.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // FETCH ACCOUNT INFO
  // -----------------------
  const fetchAccount = async () => {
    try {
      const userID = await AsyncStorage.getItem("userID");
      if (!userID) return;

      const url = `http://localhost:8080/api/account/${userID}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch account info");

      const data = await res.json();

      // Determine account type
      const type = data.courierEmail ? "courier" : "customer";
      setAccountType(type);

      // Set email/phone
      if (type === "courier") {
        setEmail(data.courierEmail ?? "");
        setPhone(data.courierPhone ?? "");
      } else {
        setEmail(data.customerEmail ?? "");
        setPhone(data.customerPhone ?? "");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMenu();
    fetchAccount();
  }, [restaurant]);

  // -----------------------
  // ORDER LOGIC
  // -----------------------
  const increaseQty = (id: string) =>
    setMenu((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );

  const decreaseQty = (id: string) =>
    setMenu((prev) =>
      prev.map((item) =>
        item.id === id && item.qty > 0 ? { ...item, qty: item.qty - 1 } : item
      )
    );

  const totalQty = menu.reduce((sum, item) => sum + item.qty, 0);
  const createOrderDisabled = totalQty === 0;

  const handleConfirmOrder = () => {
    if (useEmail && !email) {
      Alert.alert("Error", "Please enter a valid email.");
      return;
    }
    if (usePhone && !phone) {
      Alert.alert("Error", "Please enter a valid phone number.");
      return;
    }

    setOrderLoading(true);
    setSuccess(null);

    setTimeout(() => {
      const isSuccess = Math.random() > 0.3;
      setSuccess(isSuccess);
      setOrderLoading(false);
    }, 2000);
  };

  // -----------------------
  // UI
  // -----------------------
  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#ff5733" />
      </TouchableOpacity>

      <Text style={styles.title}>{restaurant.name} Menu</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ff5733" />
      ) : (
        <ScrollView>
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
        </ScrollView>
      )}

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
                  {item.name} × {item.qty} = ${(
                    item.price * item.qty
                  ).toFixed(2)}
                </Text>
              ))}

            {/* Contact Inputs */}
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
                Contact Info
              </Text>

              <Text>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="example@email.com"
                keyboardType="email-address"
              />

              <Text style={{ marginTop: 10 }}>Phone</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="123-456-7890"
                keyboardType="phone-pad"
              />
            </View>

            <Text style={styles.total}>
              Total: $
              {menu
                .filter((item) => item.qty > 0)
                .reduce((sum, item) => sum + item.qty * item.price, 0)
                .toFixed(2)}
            </Text>

            {orderLoading && <ActivityIndicator size="large" color="#ff5733" />}

            {!orderLoading && success === null && (
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
  itemImage: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  itemDetails: { flex: 1, justifyContent: "center" },
  itemName: { fontSize: 18, fontWeight: "600" },
  itemPrice: { fontSize: 14, color: "#777" },
  quantityContainer: { flexDirection: "row", alignItems: "center" },
  qtyText: { fontSize: 18, marginHorizontal: 10 },
  orderButton: {
    backgroundColor: "#ff5733",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  orderText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: "80%", backgroundColor: "#fff", padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  total: { fontWeight: "bold", marginTop: 10, marginBottom: 15 },
  confirmButton: { backgroundColor: "#28a745", padding: 12, borderRadius: 8, alignItems: "center", marginVertical: 5 },
  confirmText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  cancelButton: { backgroundColor: "#ccc", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 10 },
  cancelText: { fontSize: 16, fontWeight: "bold" },
  statusContainer: { alignItems: "center", marginTop: 15 },
  successText: { color: "green", fontSize: 18, marginTop: 10 },
  failureText: { color: "red", fontSize: 18, marginTop: 10, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginTop: 5 },
});
