import React, { useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function RestaurantListScreen({ navigation }: any) {
  const [restaurants] = useState([
    { id: "1", name: "Pizza Palace", rating: 4.5, price: "$$", image: "https://via.placeholder.com/150" },
    { id: "2", name: "Sushi Central", rating: 4.8, price: "$$$", image: "https://via.placeholder.com/150" },
    { id: "3", name: "Burger Town", rating: 4.0, price: "$", image: "https://via.placeholder.com/150" },
    { id: "4", name: "Pasta Heaven", rating: 3.9, price: "$$", image: "https://via.placeholder.com/150" },
  ]);

  const [ratingFilter, setRatingFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  const filteredRestaurants = restaurants.filter((r) => {
    const ratingMatch = ratingFilter ? r.rating >= parseFloat(ratingFilter) : true;
    const priceMatch = priceFilter ? r.price === priceFilter : true;
    return ratingMatch && priceMatch;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurants</Text>

      <View style={styles.filters}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}></Text>
          <Picker
            selectedValue={ratingFilter}
            onValueChange={(value) => setRatingFilter(value)}
            style={styles.picker}
          >
            <Picker.Item label="All Ratings" value="" />
            <Picker.Item label="4.5+" value="4.5" />
            <Picker.Item label="4.0+" value="4.0" />
            <Picker.Item label="3.5+" value="3.5" />
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}></Text>
          <Picker
            selectedValue={priceFilter}
            onValueChange={(value) => setPriceFilter(value)}
            style={styles.picker}
          >
            <Picker.Item label="All Prices" value="" />
            <Picker.Item label="$" value="$" />
            <Picker.Item label="$$" value="$$" />
            <Picker.Item label="$$$" value="$$$" />
          </Picker>
        </View>
      </View>

      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.getParent()?.navigate("Menu", { restaurant: item })}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.details}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>⭐ {item.rating} | {item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  filters: { marginBottom: 15 },
  pickerContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    overflow: "hidden",
  },
  picker: { height: 40, width: "100%" },
  label: {
    position: "absolute",
    left: 10,
    top: 5,
    zIndex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    fontSize: 12,
    color: "#555",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
  },
  image: { width: 70, height: 70, borderRadius: 8, marginRight: 15 },
  details: { flex: 1 },
  name: { fontSize: 18, fontWeight: "bold" },
});
