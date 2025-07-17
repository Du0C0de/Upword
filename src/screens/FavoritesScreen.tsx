import React, { useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Share,
  Alert,
  Animated as RNAnimated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { usePersistantState } from "../lib/storage";
import { Quote } from "../lib/types";
import { Swipeable } from "react-native-gesture-handler";

type FavoritesScreenProps = {
  theme: "light" | "dark";
  setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
};

export default function FavoritesScreen({ theme }: FavoritesScreenProps) {
  const navigation = useNavigation();
  const [favorites, setFavorites] = usePersistantState("FAVORITES", {
    readInitialStateFromStorage: true,
  });

  const openRow = useRef<Swipeable | null>(null);
  const swipeableRefs = useRef<Map<number, Swipeable | null>>(new Map());

  const backgroundColor = theme === "dark" ? "#000" : "#fff";
  const textColor = theme === "dark" ? "#fff" : "#000";
  const deleteColor = theme === "dark" ? "#ff453a" : "#ff3b30";
  const shareColor = theme === "dark" ? "#0a84ff" : "#007aff";

  const handleDelete = (quoteToRemove: Quote) => {
    if (openRow.current) openRow.current.close();
    Alert.alert("Remove Favorite", "Are you sure you want to remove this quote?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () =>
          setFavorites(
            favorites.filter(
              (q) => q.quote !== quoteToRemove.quote || q.author !== quoteToRemove.author
            )
          ),
      },
    ]);
  };

  const handleShare = async (quote: Quote) => {
    if (openRow.current) openRow.current.close();
    try {
      await Share.share({
        message: `“${quote.quote}” — ${quote.author}\n\nShared from the Daily Quotes App!`,
      });
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  const renderRightActions = (
    progress: RNAnimated.AnimatedInterpolation<number>,
    item: Quote
  ) => {
    const slide = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [128, 0],
      extrapolate: "clamp",
    });

    return (
      <RNAnimated.View
        style={[
          styles.actionsContainer,
          {
            transform: [{ translateX: slide }],
          },
        ]}
      >
        <Pressable
          style={[styles.connectedButton, { backgroundColor: deleteColor }]}
          onPress={() => handleDelete(item)}
        >
          <MaterialIcons name="delete" size={28} color="#fff" />
        </Pressable>
        <Pressable
          style={[styles.connectedButton, { backgroundColor: shareColor }]}
          onPress={() => handleShare(item)}
        >
          <MaterialIcons name="share" size={28} color="#fff" />
        </Pressable>
      </RNAnimated.View>
    );
  };

  const renderItem = ({ item, index }: { item: Quote; index: number }) => {
    return (
      <Swipeable
        ref={(ref) => {
          swipeableRefs.current.set(index, ref);
        }}
        renderRightActions={(progress) => renderRightActions(progress, item)}
        onSwipeableOpen={() => {
          const ref = swipeableRefs.current.get(index);
          if (openRow.current && openRow.current !== ref) {
            openRow.current.close();
          }
          openRow.current = ref ?? null;
        }}
        onSwipeableClose={() => {
          const ref = swipeableRefs.current.get(index);
          if (openRow.current === ref) {
            openRow.current = null;
          }
        }}
        friction={1.5}
        overshootRight={false}
        hitSlop={{ right: 0 }}
      >
        <View style={styles.swipeableWrapper}>
          <Pressable style={styles.quoteRow}>
            <Text style={[styles.quote, { color: textColor }]}>“{item.quote}”</Text>
            <Text style={[styles.author, { color: textColor }]}>— {item.author}</Text>
          </Pressable>
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Pressable style={styles.backIcon} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color={textColor} />
        </Pressable>
        <Text style={[styles.title, { color: textColor }]}>Your Favorite Quotes</Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  swipeableWrapper: {
    backgroundColor: "transparent",
  },
  quoteRow: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
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
  actionsContainer: {
    width: 128,
    height: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "stretch",
    overflow: "hidden",
  },
  connectedButton: {
    width: 64,
    justifyContent: "center",
    alignItems: "center",
  },
});
