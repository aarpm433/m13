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
  "Mayert-Leannon": require("../../assets/support_materials_13/Images/Restaurants/cuisineGreek.jpg"),
  "Luettgen, Hayes and Dietrich": require("../../assets/support_materials_13/Images/Restaurants/cuisineJapanese.jpg"),
  "Upton LLC": require("../../assets/support_materials_13/Images/Restaurants/cuisinePasta.jpg"),
  "Boehm LLC": require("../../assets/support_materials_13/Images/Restaurants/cuisinePizza.jpg"),
  "Durgan, Bayer and Hills": require("../../assets/support_materials_13/Images/Restaurants/cuisineSoutheast.jpg"),
  "Kilback-Doyle": require("../../assets/support_materials_13/Images/Restaurants/cuisineViet.jpg"),
  "Kuphal LLC": require("../../assets/support_materials_13/Images/Restaurants/cuisineGreek.jpg"),
  "Kessler-Gulgowski": require("../../assets/support_materials_13/Images/Restaurants/cuisineJapanese.jpg"),
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
  const fetchRestaurants = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/api/restaurants", {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        console.error("❌ Failed to fetch restaurants:", response.status, response.statusText);
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const result = await response.json();

      // Adapt to your backend JSON structure:
      // Either result.data (if ResponseBuilder wraps it), or result directly
      const data = Array.isArray(result.data) ? result.data : result;

      setRestaurants(
        data.map((r: any) => ({
          id: r.id.toString(),
          name: r.name,
          rating: r.rating ?? 3,
          price: "$".repeat(r.price_range ?? 1),
          active: r.active ?? true,
          imagePath: imageMap[r.name] || require("../../assets/support_materials_13/Images/RestaurantMenu.jpg"),
        }))
      );
    } catch (error) {
      console.error("🔥 Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
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
              {ratingFilter ? `${ratingFilter}+` : "-- Select rating -- ⏷"}
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
            <Text style={styles.dropdownLabel}>{priceFilter || "-- Select price -- ⏷"}</Text>
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
