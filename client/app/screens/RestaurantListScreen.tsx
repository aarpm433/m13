import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

// Map restaurant names to local images
const imageMap: { [key: string]: any } = {
  "Mayert-Leannon": require("../../assets/support_materials_13/Images/RestaurantMenu.jpg"),
  "Luettgen, Hayes and Dietrich": require("../../assets/support_materials_13/Images/RestaurantMenu.jpg"),
  "Upton LLC": require("../../assets/support_materials_13/Images/RestaurantMenu.jpg"),
  "Boehm LLC": require("../../assets/support_materials_13/Images/RestaurantMenu.jpg"),
  "Durgan, Bayer and Hills": require("../../assets/support_materials_13/Images/RestaurantMenu.jpg"),
  "Kilback-Doyle": require("../../assets/support_materials_13/Images/RestaurantMenu.jpg"),
  "Kuphal LLC": require("../../assets/support_materials_13/Images/RestaurantMenu.jpg"),
  "Kessler-Gulgowski": require("../../assets/support_materials_13/Images/RestaurantMenu.jpg"),
};


export default function RestaurantListScreen({ navigation }: any) {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState<string | number | null>("");
  const [priceFilter, setPriceFilter] = useState<string>("");

  const { width } = useWindowDimensions();
  const [columns, setColumns] = useState(width >= 900 ? 3 : width >= 420 ? 2 : 1);

  const horizontalPadding = 16;
  const gap = 16;
  const cardWidth = (width - horizontalPadding * 2 - gap * (columns - 1)) / columns;

  useEffect(() => {
    setColumns(width >= 900 ? 3 : width >= 420 ? 2 : 1);
  }, [width]);

  useEffect(() => {
    // Simulate fetching restaurants
    const fetchRestaurants = async () => {
      setLoading(true);

      const data = [
        { id: 1, name: "Mayert-Leannon", rating: 3, price_range: 3, active: true },
        { id: 2, name: "Luettgen, Hayes and Dietrich", rating: 3, price_range: 1, active: true },
        { id: 3, name: "Upton LLC", rating: 4, price_range: 1, active: true },
        { id: 4, name: "Boehm LLC", rating: 4, price_range: 3, active: true },
        { id: 5, name: "Durgan, Bayer and Hills", rating: 3, price_range: 3, active: true },
        { id: 6, name: "Kilback-Doyle", rating: 3, price_range: 2, active: true },
        { id: 7, name: "Kuphal LLC", rating: 4, price_range: 1, active: true },
        { id: 8, name: "Kessler-Gulgowski", rating: 3, price_range: 2, active: true },
      ];

    setRestaurants(
      data.map((r) => ({
        id: r.id.toString(),
        name: r.name,
        rating: r.rating,
        price: "$".repeat(r.price_range),
        active: r.active,
        imagePath: imageMap[r.name] || require("../../assets/support_materials_13/Images/RestaurantMenu.jpg"),
      }))
    );

      setLoading(false);
    };

    fetchRestaurants();
  }, []);

  const filtered = useMemo(() => {
    return restaurants.filter((r) => {
      const ratingMatch = ratingFilter ? r.rating >= parseFloat(String(ratingFilter)) : true;
      const priceMatch = priceFilter ? r.price === priceFilter : true;
      return ratingMatch && priceMatch;
    });
  }, [ratingFilter, priceFilter, restaurants]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#DA583B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NEARBY RESTAURANTS</Text>

      {/* Filters */}
      <View style={styles.filtersRow}>
        <View style={styles.filter}>
          <Text style={styles.filterLabel}></Text>
          <View style={styles.dropdownWrapper}>
            <Text style={styles.dropdownLabel}>
              {ratingFilter ? `${ratingFilter}+` : "Select rating"}
            </Text>
            <Picker
              selectedValue={ratingFilter}
              onValueChange={(value) => setRatingFilter(value)}
              mode="dropdown"
              dropdownIconColor="#fff"
              style={[StyleSheet.absoluteFillObject, { opacity: 0 }]}
            >
              <Picker.Item label="Select rating" value="" />
              <Picker.Item label="4.5+" value="4.5" />
              <Picker.Item label="4.0+" value="4.0" />
              <Picker.Item label="3.5+" value="3.5" />
            </Picker>
          </View>
        </View>

        <View style={styles.filter}>
          <Text style={styles.filterLabel}></Text>
          <View style={styles.dropdownWrapper}>
            <Text style={styles.dropdownLabel}>{priceFilter || "Select price"}</Text>
            <Picker
              selectedValue={priceFilter}
              onValueChange={(value) => setPriceFilter(value)}
              mode="dropdown"
              dropdownIconColor="#fff"
              style={[StyleSheet.absoluteFillObject, { opacity: 0 }]}
            >
              <Picker.Item label="Select price" value="" />
              <Picker.Item label="$" value="$" />
              <Picker.Item label="$$" value="$$" />
              <Picker.Item label="$$$" value="$$$" />
            </Picker>
          </View>
        </View>
      </View>

      {/* Restaurant List */}
      <Text style={styles.sectionTitle}>RESTAURANTS</Text>

      <FlatList
        key={columns}
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={
          columns > 1
            ? { justifyContent: "space-between", paddingHorizontal: horizontalPadding }
            : undefined
        }
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { width: cardWidth }]}
            onPress={() => navigation.navigate("Menu", { restaurant: item })}
            activeOpacity={0.85}
          >
            <Image source={item.imagePath} style={styles.image} />
            <View style={styles.cardBody}>
              <Text style={styles.name} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.meta}>
                {item.price} · ⭐ {item.rating.toFixed(1)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center", marginVertical: 20 },
  filtersRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 12 },
  filter: { alignItems: "center" },
  filterLabel: { fontWeight: "600", marginBottom: 4 },
  dropdownWrapper: {
    borderRadius: 8,
    backgroundColor: "#DA583B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    position: "relative",
  },
  dropdownLabel: { color: "#fff", fontWeight: "600" },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginLeft: 16, marginBottom: 8 },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  image: { width: "100%", height: 140 },
  cardBody: { padding: 10 },
  name: { fontSize: 16, fontWeight: "600" },
  meta: { fontSize: 14, color: "#555", marginTop: 4 },
});
