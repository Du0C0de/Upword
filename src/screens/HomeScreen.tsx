import React from "react";
import { View, Text, StyleSheet } from "react-native";

type HomeScreenProps = {
  theme: "light" | "dark";
};

export default function HomeScreen({ theme }: HomeScreenProps) {
  const textColor = theme === "dark" ? "#fff" : "#000";
  const bgColor = theme === "dark" ? "#000" : "#fff";

  console.log("Rendering HomeScreen with theme:", theme);

  return (
    <View style={[styles.container, { backgroundColor: "transparent" }]}>
      <Text style={[styles.quote, { color: textColor }]}>
        Hello from HomeScreen 👋
      </Text>
      <Text style={[styles.author, { color: textColor }]}>
        Theme: {theme}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  quote: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  author: {
    fontSize: 16,
    marginTop: 10,
    fontStyle: "italic",
    textAlign: "center",
  },
});
