//
// NOT A STOISIM APP
//

import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableWithoutFeedback, Animated } from "react-native";

import getQuote, { Quote } from "../lib/quotes";
import { useDefinedColors } from "../lib/colors";
import { usePersistantState } from "../lib/storage";
import { SIMPLE_ANIMATION_CONTROLS, SimpleAnimation } from "../lib/animations";
import { Directions, Gesture, GestureDetector } from "react-native-gesture-handler";

const DEFAULT_QUOTE: Quote = {
    author: "DuoCode",
    quote: "The page is loading 🏛",
    date: new Date(Date.now()).getFullYear(),
};

export default function HomeScreen() {
    const definedColors = useDefinedColors();
    const tap = Gesture.Tap().onEnd(() => {
        console.log("Tapped");
        showNextQuote("none");
    });
    const flingUp = Gesture.Fling()
        .direction(Directions.UP)
        .onEnd(() => {
            showNextQuote("up");
        });
    const flingDown = Gesture.Fling()
        .direction(Directions.DOWN)
        .onEnd(() => {
            showNextQuote();
        });

    const [animatedValues] = useState({
        yOffset: new Animated.Value(0, { useNativeDriver: true }),
        opacity: new Animated.Value(1, { useNativeDriver: true }),
        reset() {
            animatedValues.yOffset.setValue(0);
            animatedValues.opacity.setValue(1);
        },
    });

    const [persistantQuote, setPersistantQuote] = usePersistantState("LAST-QUOTE", {
        readInitialStateFromStorage: true,
    });

    const showNextQuote = (fadeDirection: "up" | "down" | "none" = "down") => {
        (async () => {
            SIMPLE_ANIMATION_CONTROLS.FADE_DIRECTION = fadeDirection;

            await SimpleAnimation.dropOutFadeOut(
                animatedValues.yOffset,
                animatedValues.opacity
            );

            setPersistantQuote(getQuote());

            await SimpleAnimation.dropInFadeIn(
                animatedValues.yOffset,
                animatedValues.opacity,
                { reset: animatedValues.reset }
            );
        })();
    };

    useEffect(() => {
        animatedValues.opacity.setValue(1);
        if (persistantQuote != null) return;

        setPersistantQuote({ ...DEFAULT_QUOTE });
    }, []);

    return (
        <GestureDetector gesture={flingUp}>
            <GestureDetector gesture={flingDown}>
                <GestureDetector gesture={tap}>
                    <View
                        style={[
                            styles.container,
                            { backgroundColor: definedColors.BACKGROUND },
                        ]}
                    >
                        <Animated.Text
                            style={[
                                styles.quote,
                                {
                                    color: definedColors.TEXT,
                                    opacity: animatedValues.opacity,
                                    transform: [{ translateY: animatedValues.yOffset }],
                                },
                            ]}
                        >
                            {persistantQuote && persistantQuote.quote}
                        </Animated.Text>
                        <Animated.Text
                            style={[
                                styles.author,
                                {
                                    color: definedColors.TEXT,
                                    opacity: animatedValues.opacity,
                                    transform: [
                                        {
                                            translateY: animatedValues.yOffset,
                                        },
                                    ],
                                },
                            ]}
                        >
                            {persistantQuote &&
                                `- ${persistantQuote.author}${
                                    persistantQuote.date ? ", " + persistantQuote.date : ""
                                }`}
                        </Animated.Text>
                    </View>
                </GestureDetector>
            </GestureDetector>
        </GestureDetector>
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
