import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Share,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { usePersistantState } from "../lib/storage";
import { SIMPLE_ANIMATION_CONTROLS, SimpleAnimation } from "../lib/animations";
import getQuote from "../lib/quotes";
import { Directions, Gesture, GestureDetector } from "react-native-gesture-handler";
import { Quote } from "../lib/types";
import * as Haptics from "expo-haptics";
import { Animated as RNAnimated } from "react-native";

type HomeScreenProps = {
  theme: "light" | "dark";
};

type AnimationState = {
  runState: "running" | "done";
  yOffset: Animated.Value;
  opacity: Animated.Value;
};

export default function HomeScreen({ theme }: HomeScreenProps) {
  const navigation = useNavigation();
  const textColor = theme === "dark" ? "#fff" : "#000";

  const flingUp = Gesture.Fling().direction(Directions.UP).onEnd(() => onQuotePress("up"));
  const flingDown = Gesture.Fling().direction(Directions.DOWN).onEnd(() => onQuotePress("down"));

  const [lastQuote, setLastQuote] = usePersistantState("LAST-QUOTE", {
    readInitialStateFromStorage: true,
  });

  const [favorites, setFavorites] = usePersistantState("FAVORITES", {
    readInitialStateFromStorage: true,
  });

  const [animationState] = useState<AnimationState>({
    runState: "done",
    yOffset: new Animated.Value(0),
    opacity: new Animated.Value(1),
  });

  const [heartScale] = useState(new RNAnimated.Value(1));

  const floatingHeartOpacity = useRef(new RNAnimated.Value(0)).current;
  const floatingHeartY = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    if (!lastQuote) {
      const quote = getQuote();
      setLastQuote(quote);
    }
  }, [lastQuote]);

  const onQuotePress = async (fadeoutDirection: "up" | "down" | null = null) => {
    SIMPLE_ANIMATION_CONTROLS.FADE_DIRECTION = fadeoutDirection ?? "none";
    await SimpleAnimation.dropOutFadeOut(animationState.yOffset, animationState.opacity);

    const newQuote = getQuote();
    setLastQuote(newQuote);

    await SimpleAnimation.dropInFadeIn(animationState.yOffset, animationState.opacity);
  };

  const handleShare = async () => {
    if (!lastQuote) return;

    try {
      await Share.share({
        message: `“${lastQuote.quote}” — ${lastQuote.author}\n\nCheck out the Daily Quotes App!`,
        url: "https://your-app-link.com",
        title: "Inspiring Quote",
      });
    } catch (error) {
      console.error("Error sharing quote:", error);
    }
  };

  const triggerFloatingHeart = () => {
    floatingHeartOpacity.setValue(1);
    floatingHeartY.setValue(0);

    RNAnimated.parallel([
      RNAnimated.timing(floatingHeartY, {
        toValue: -40,
        duration: 600,
        useNativeDriver: true,
      }),
      RNAnimated.timing(floatingHeartOpacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleFavorite = async () => {
    if (!lastQuote) return;

    Haptics.selectionAsync();

    RNAnimated.sequence([
      RNAnimated.timing(heartScale, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      RNAnimated.timing(heartScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const exists = favorites.some(
      (fav) => fav.quote === lastQuote.quote && fav.author === lastQuote.author
    );

    if (exists) {
      setFavorites(favorites.filter((fav) => fav.quote !== lastQuote.quote));
    } else {
      setFavorites([...favorites, lastQuote]);
      triggerFloatingHeart();
      await onQuotePress(); // Move to next quote
    }
  };

  const isFavorited = lastQuote
    ? favorites.some(
        (fav) => fav.quote === lastQuote.quote && fav.author === lastQuote.author
      )
    : false;

  return (
    <GestureDetector gesture={flingDown}>
      <GestureDetector gesture={flingUp}>
        <Pressable style={styles.flex} onPress={() => onQuotePress(null)}>
          <View style={[styles.container, { backgroundColor: "transparent" }]}>
            {lastQuote ? (
              <Animated.View
                style={{
                  opacity: animationState.opacity,
                  transform: [{ translateY: animationState.yOffset }],
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

            <Pressable style={styles.heartIcon} onPress={toggleFavorite}>
              <RNAnimated.View style={{ transform: [{ scale: heartScale }] }}>
                <Ionicons
                  name={isFavorited ? "heart" : "heart-outline"}
                  size={28}
                  color={textColor}
                />
              </RNAnimated.View>
            </Pressable>

            {/* ❤️ Floating Heart Animation */}
            <RNAnimated.View
              pointerEvents="none"
              style={{
                position: "absolute",
                bottom: 180,
                alignSelf: "center",
                opacity: floatingHeartOpacity,
                transform: [{ translateY: floatingHeartY }],
              }}
            >
              <Ionicons name="heart" size={28} color={textColor} />
            </RNAnimated.View>

            <Pressable
              style={styles.favScreenIcon}
              onPress={() => navigation.navigate("Favorites" as never)}
            >
              <MaterialIcons name="favorite" size={26} color={textColor} />
            </Pressable>
          </View>
        </Pressable>
      </GestureDetector>
    </GestureDetector>
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
  heartIcon: {
    position: "absolute",
    bottom: 160,
    alignSelf: "center",
    padding: 10,
  },
  favScreenIcon: {
    position: "absolute",
    top: 60,
    right: 20,
    padding: 10,
  },
});
