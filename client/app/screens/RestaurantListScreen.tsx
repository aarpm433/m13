import React, { useMemo, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  useWindowDimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function RestaurantListScreen({ navigation }: any) {
  const allRestaurants = [
    {
      id: "1",
      name: "Golden Bar & Grill",
      rating: 4.5,
      price: "$$",
      image: require("/home/aaron/Codeboxx/m13/fcc/Food--template/assets/support_materials_13/Images/Restaurants/cuisineViet.jpg"),
    },
    {
      id: "2",
      name: "WJU Eats",
      rating: 4.8,
      price: "$$$",
      image: require("/home/aaron/Codeboxx/m13/fcc/Food--template/assets/support_materials_13/Images/Restaurants/cuisineViet.jpg"),
    },
    {
      id: "3",
      name: "Sweet Dragon",
      rating: 4.0,
      price: "$",
      image: require("/home/aaron/Codeboxx/m13/fcc/Food--template/assets/support_materials_13/Images/Restaurants/cuisineViet.jpg"),
    },
    {
      id: "4",
      name: "Golden Creamery",
      rating: 3.9,
      price: "$$",
      image: require("/home/aaron/Codeboxx/m13/fcc/Food--template/assets/support_materials_13/Images/Restaurants/cuisineViet.jpg"),
    },
  ];

  const [ratingFilter, setRatingFilter] = useState<string | number | null>("");
  const [priceFilter, setPriceFilter] = useState<string>("");

  const { width } = useWindowDimensions();
  const columns = width >= 900 ? 3 : width >= 420 ? 2 : 1;
  const horizontalPadding = 16;
  const gap = 16;
  const cardWidth = (width - horizontalPadding * 2 - gap * (columns - 1)) / columns;

  const filtered = useMemo(() => {
    return allRestaurants.filter((r) => {
      const ratingMatch = ratingFilter ? r.rating >= parseFloat(String(ratingFilter)) : true;
      const priceMatch = priceFilter ? r.price === priceFilter : true;
      return ratingMatch && priceMatch;
    });
  }, [ratingFilter, priceFilter]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NEARBY RESTAURANTS</Text>

    <View style={styles.filtersRow}>
      {/* Rating Filter */}
      <View style={styles.filter}>
        <Text style={styles.filterLabel}>Rating</Text>
        <View style={styles.dropdownWrapper}>
          <Text style={styles.dropdownLabel}>
            {ratingFilter ? `${ratingFilter}+` : "Select rating"}
          </Text>
          <Picker
            selectedValue={ratingFilter}
            onValueChange={(value) => setRatingFilter(value)}
            mode="dropdown"
            dropdownIconColor="#fff"
            style={styles.hiddenPicker}
          >
            <Picker.Item label="Select rating" value="" />
            <Picker.Item label="4.5+" value="4.5" />
            <Picker.Item label="4.0+" value="4.0" />
            <Picker.Item label="3.5+" value="3.5" />
          </Picker>
        </View>
      </View>

        <View style={styles.filter}>
          <Text style={styles.filterLabel}>Price</Text>
          <View style={styles.dropdownWrapper}>
          <Text style={styles.dropdownLabel}>
            {priceFilter ? `${priceFilter}+` : "Select price"}
          </Text>
          <Picker
            selectedValue={priceFilter}
            onValueChange={(value) => setPriceFilter(value)}
            mode="dropdown"
            dropdownIconColor="#fff"
            style={styles.hiddenPicker}
          >
            <Picker.Item label="Select rating" value="" />
            <Picker.Item label="$" value="$" />
            <Picker.Item label="$$" value="$$" />
            <Picker.Item label="$$$" value="$$$" />
          </Picker>
        </View>

        </View>
      </View>

      <Text style={styles.sectionTitle}>RESTAURANTS</Text>

      <FlatList
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
            <Image source={item.image} style={styles.image} />
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
        extraData={columns}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F6F6", paddingTop: 12 },
  title: { fontSize: 16, fontWeight: "700", marginHorizontal: 16, marginBottom: 8, color: "#222" },

  filtersRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    gap: 12,
  },
  filter: { flex: 1 },
  filterLabel: { fontSize: 13, fontWeight: "700", marginBottom: 6 },

  dropdownWrapper: {
    backgroundColor: "#DA583B",
    borderRadius: 8,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  dropdownLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  hiddenPicker: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0, // invisible but clickable
  },





  sectionTitle: { fontSize: 16, fontWeight: "700", marginHorizontal: 16, marginTop: 16 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  image: { width: "100%", height: 120, resizeMode: "cover" },
  cardBody: { padding: 10 },
  name: { fontSize: 14, fontWeight: "700", color: "#111" },
  meta: { marginTop: 6, color: "#666", fontSize: 13 },
});
