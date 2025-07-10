//
// NOT A STOISIM APP
//

import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableWithoutFeedback, Animated } from "react-native";

import getQuote, { Quote } from "../lib/quotes";
import { useDefinedColors } from "../lib/colors";
import { readFromStorage, writeToStorage } from "../lib/storage";

const FALL_TIME_MS = 300;
const FADE_TIME_MS = 200;
const DEFAULT_QUOTE: Quote = {
    author: "DuoCode",
    quote: "The page is loading 🏛",
    date: new Date(Date.now()).getFullYear(),
};

const fade = (value: Animated.Value, toVal: number) =>
    Animated.timing(value, {
        toValue: toVal,
        duration: FADE_TIME_MS,
        useNativeDriver: true,
    });

const fall = (value: Animated.Value, toVal: number) =>
    Animated.timing(value, {
        toValue: toVal,
        duration: FALL_TIME_MS,
        useNativeDriver: true,
    });

export default function HomeScreen() {
    const fadeValue = useRef(new Animated.Value(1));
    const fallValue = useRef(new Animated.Value(0));
    const definedColors = useDefinedColors();

    const [shownQuote, setShownQuote] = useState<Quote>({ ...DEFAULT_QUOTE });
    const [initalStartup, setStartup] = useState<Quote>();

    useEffect(() => {
        readFromStorage("LAST-QUOTE", (obj) => {
            return { ...obj } as Quote;
        }).then((quote) => {
            setStartup({ ...quote });
        });
    }, []);

    useEffect(() => {
        if (initalStartup == null) return;

        setShownQuote({ ...initalStartup });
    }, [initalStartup]);

    useEffect(() => {
        if (shownQuote == null) return;

        fallValue.current.setValue(20);
        fadeValue.current.setValue(0);
        Animated.parallel([
            fade(fadeValue.current, 1),
            fall(fallValue.current, 0),
        ]).start();

        writeToStorage("LAST-QUOTE", shownQuote);
    }, [shownQuote]);

    const showNextQuote = (quote: Quote) => {
        const fadeOutQuote = () => {
            // Fade to 0, Fall to -20
            Animated.parallel([
                fade(fadeValue.current, 0),
                fall(fallValue.current, -20),
            ]).start(() => {
                setShownQuote(() => ({ ...quote }));
            });
        };
        fadeOutQuote();
    };

    return (
        <TouchableWithoutFeedback onPress={() => showNextQuote(getQuote())}>
            <View
                style={[styles.container, { backgroundColor: definedColors.BACKGROUND }]}
            >
                <Animated.Text
                    style={[
                        styles.quote,
                        {
                            color: definedColors.TEXT,
                            opacity: fadeValue.current,
                            transform: [{ translateY: fallValue.current }],
                        },
                    ]}
                >
                    {shownQuote.quote}
                </Animated.Text>
                <Animated.Text
                    style={[
                        styles.author,
                        {
                            color: definedColors.TEXT,
                            opacity: fadeValue.current,
                            transform: [
                                {
                                    translateY: fallValue.current,
                                },
                            ],
                        },
                    ]}
                >
                    — {shownQuote.author}
                    {shownQuote.date ? ", " + shownQuote.date : ""}
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
