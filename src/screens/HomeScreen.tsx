import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Animated, Share } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { usePersistantState } from "../lib/storage";
import { SIMPLE_ANIMATION_CONTROLS, SimpleAnimation } from "../lib/animations";
import getQuote from "../lib/quotes";
import { Directions, Gesture, GestureDetector } from "react-native-gesture-handler";

type HomeScreenProps = {
    theme: "light" | "dark";
};

type AnimationState = {
    runState: "running" | "done";
    yOffset: Animated.Value;
    opacity: Animated.Value;
};

export default function HomeScreen({ theme }: HomeScreenProps) {
    const flingUp = Gesture.Fling()
        .direction(Directions.UP)
        .onEnd(() => onQuotePress("up"));
    const flingDown = Gesture.Fling()
        .direction(Directions.DOWN)
        .onEnd(() => onQuotePress("down"));

    const textColor = theme === "dark" ? "#fff" : "#000";

    const [lastQuote, setLastQuote] = usePersistantState("LAST-QUOTE", {
        readInitialStateFromStorage: true,
    });

    const [animationState] = useState<AnimationState>({
        runState: "done",
        yOffset: new Animated.Value(0),
        opacity: new Animated.Value(1),
    });

    useEffect(() => {
        if (!lastQuote) {
            // No persistant quote in storage
            const quote = getQuote();
            setLastQuote(quote);
        }
    }, [lastQuote]);

    const onQuotePress = async (fadeoutDirection: "up" | "down" | null = null) => {
        SIMPLE_ANIMATION_CONTROLS.FADE_DIRECTION = fadeoutDirection ?? "none";
        await SimpleAnimation.dropOutFadeOut(
            animationState.yOffset,
            animationState.opacity
        );

        const newQuote = getQuote();
        setLastQuote(newQuote);

        await SimpleAnimation.dropInFadeIn(animationState.yOffset, animationState.opacity);
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
});
