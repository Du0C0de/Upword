import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Share,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import getQuote from "../lib/quotes";
import { usePersistantState } from "../lib/storage";
import { SimpleAnimation } from "../lib/animations";

type HomeScreenProps = {
  theme: "light" | "dark";
};

export default function HomeScreen({ theme }: HomeScreenProps) {
  const textColor = theme === "dark" ? "#fff" : "#000";

  const [lastQuote, setLastQuote] = usePersistantState("LAST-QUOTE", {
    readInitialStateFromStorage: true,
  });

  const yOffset = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!lastQuote) {
      const quote = getQuote();
      setLastQuote(quote);
    }
  }, [lastQuote]);

  const onQuotePress = async () => {
    await SimpleAnimation.dropOutFadeOut(yOffset, opacity, {
      reset: () => {
        const newQuote = getQuote();
        setLastQuote(newQuote);
      },
    });

    await SimpleAnimation.dropInFadeIn(yOffset, opacity);
  };

  const handleShare = async () => {
    if (!lastQuote) return;

    try {
      await Share.share({
        message: `“${lastQuote.quote}” — ${lastQuote.author}\n\nCheck out the Daily Quotes App!`,
        url: "https://your-app-link.com", // Replace with your real app link
        title: "Inspiring Quote",
      });
    } catch (error) {
      console.error("Error sharing quote:", error);
    }
  };

  return (
    <Pressable style={styles.flex} onPress={onQuotePress}>
      <View style={[styles.container, { backgroundColor: "transparent" }]}>
        {lastQuote ? (
          <Animated.View
            style={{
              opacity,
              transform: [{ translateY: yOffset }],
            }}
          >
            <Text style={[styles.quote, { color: textColor }]}>
              “{lastQuote.quote}”
            </Text>
            <Text style={[styles.author, { color: textColor }]}>
              — {lastQuote.author}
            </Text>
          </Animated.View>
        ) : (
          <Text style={{ color: textColor }}>Loading quote...</Text>
        )}
        <Pressable style={styles.shareIcon} onPress={handleShare}>
          <MaterialIcons name="share" size={28} color={textColor} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
  shareIcon: {
    position: "absolute",
    bottom: 50,
    left: 20,
    padding: 10,
  },
});
