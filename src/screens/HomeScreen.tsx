//
// NOT A STOISIM APP
//

import React, { useState } from "react";
import { View, StyleSheet, TouchableWithoutFeedback, Animated } from "react-native";

import getQuote, { Quote } from "../lib/quotes";
import { useDefinedColors } from "../lib/colors";
import { usePersistantState } from "../lib/storage";
import { SIMPLE_ANIMATION_CONTROLS, SimpleAnimation } from "../lib/animations";

const DEFAULT_QUOTE: Quote = {
    author: "DuoCode",
    quote: "The page is loading 🏛",
    date: new Date(Date.now()).getFullYear(),
};

export default function HomeScreen() {
    const definedColors = useDefinedColors();
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

    const showNextQuote = () => {
        (async () => {
            SIMPLE_ANIMATION_CONTROLS.Y_OFFSET_MAX_TRAVEL_DISTANCE = 20;

            await SimpleAnimation.dropOutFadeOut(
                animatedValues.yOffset,
                animatedValues.opacity
            );

            setPersistantQuote(getQuote());

            SIMPLE_ANIMATION_CONTROLS.Y_OFFSET_MAX_TRAVEL_DISTANCE = 25;

            await SimpleAnimation.dropInFadeIn(
                animatedValues.yOffset,
                animatedValues.opacity,
                { reset: animatedValues.reset }
            );
        })();
    };

    return (
        <TouchableWithoutFeedback onPress={() => showNextQuote()}>
            <View
                style={[styles.container, { backgroundColor: definedColors.BACKGROUND }]}
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
        </TouchableWithoutFeedback>
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
