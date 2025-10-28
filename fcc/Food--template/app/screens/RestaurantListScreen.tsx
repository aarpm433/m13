import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function RestaurantListScreen({ navigation }: any) {
  const [restaurants, setRestaurants] = useState([
    { id: "1", name: "Pizza Palace" },
    { id: "2", name: "Sushi Central" },
    { id: "3", name: "Burger Town" },
  ]);

  return (
    <View style={styles.container}>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => Alert.alert("Selected", item.name)}
          >
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: { padding: 15, borderWidth: 1, borderRadius: 8, marginBottom: 10 },
  name: { fontSize: 18, fontWeight: "bold" },
});
