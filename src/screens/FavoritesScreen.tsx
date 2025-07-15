import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { usePersistantState } from "../lib/storage";
import { Quote } from "../lib/types";

export default function FavoritesScreen() {
  const [favorites] = usePersistantState("FAVORITES", {
    readInitialStateFromStorage: true,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Favorite Quotes</Text>
      <FlatList<Quote>
        data={favorites}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.quoteBox}>
            <Text style={styles.quote}>“{item.quote}”</Text>
            <Text style={styles.author}>— {item.author}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  quoteBox: {
    marginBottom: 20,
  },
  quote: {
    fontSize: 18,
    fontWeight: "500",
  },
  author: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 5,
  },
});
