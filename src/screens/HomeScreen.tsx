//
// NOT A STOISIM APP
//

import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    Animated,
    Pressable,
} from "react-native";

import getQuote, { Quote } from "../lib/quotes";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

type ScreenState = {
    shownQuote: Quote;
    backgroundColor: string;
    textColor: string;
};

const BG_COLOR = { LIGHT: "#FFFFFF", DARK: "#121212" };
const TEXT_COLOR = { LIGHT: "#000000", DARK: "#FFFFFF" };
const FALL_TIME_MS = 300;
const FADE_TIME_MS = 200;
const DEFAULT_QUOTE = {
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

export default function HomeScreen(props: {
    colorSetter: (ctx: { bgc: string; tc: string }) => void;
}) {
    const fadeValue = useRef(new Animated.Value(1));
    const fallValue = useRef(new Animated.Value(0));

    const [meta, setMeta] = useState({
        colorScheme: "dark",
    });

    const [state, setState] = useState<ScreenState>({
        shownQuote: DEFAULT_QUOTE,
        backgroundColor: BG_COLOR.DARK,
        textColor: TEXT_COLOR.DARK,
    });

    useEffect(() => {
        const scheme = meta.colorScheme;
        setState((prev) => {
            const out = {
                ...prev,
                backgroundColor: scheme === "dark" ? BG_COLOR.DARK : BG_COLOR.LIGHT,
                textColor: scheme === "dark" ? TEXT_COLOR.DARK : TEXT_COLOR.LIGHT,
            };

            props.colorSetter({ bgc: out.backgroundColor, tc: out.textColor });

            return out;
        });
    }, [meta]);

    useEffect(() => {
        fallValue.current.setValue(20);
        fadeValue.current.setValue(0);
        Animated.parallel([
            fade(fadeValue.current, 1),
            fall(fallValue.current, 0),
        ]).start();
    }, [state.shownQuote]);

    const showNextQuote = (quote: Quote) => {
        const fadeOutQuote = () => {
            // Fade to 0, Fall to -20
            Animated.parallel([
                fade(fadeValue.current, 0),
                fall(fallValue.current, -20),
            ]).start(() => {
                setState((prev) => ({ ...prev, shownQuote: quote }));
            });
        };

        fadeOutQuote();
    };

    return (
        <TouchableWithoutFeedback onPress={() => showNextQuote(getQuote())}>
            <View style={[styles.container, { backgroundColor: state.backgroundColor }]}>
                <Animated.Text
                    style={[
                        styles.quote,
                        {
                            color: state.textColor,
                            opacity: fadeValue.current,
                            transform: [{ translateY: fallValue.current }],
                        },
                    ]}
                >
                    {state.shownQuote.quote}
                </Animated.Text>
                <Animated.Text
                    style={[
                        styles.author,
                        {
                            color: state.textColor,
                            opacity: fadeValue.current,
                            transform: [
                                {
                                    translateY: fallValue.current,
                                },
                            ],
                        },
                    ]}
                >
                    — {state.shownQuote.author}
                </Animated.Text>

                <View style={{ position: "absolute", bottom: 20, right: 20 }}>
                    <Pressable
                        hitSlop={{ top: 20, left: 10, bottom: 10, right: 10 }}
                        onPress={() => {
                            setMeta((prev) => ({
                                ...prev,
                                colorScheme:
                                    meta.colorScheme === "dark" ? "light" : "dark",
                            }));
                        }}
                    >
                        {meta.colorScheme === "dark" ? (
                            <MaterialIcons name="light-mode" size={32} color="white" />
                        ) : (
                            <MaterialIcons name="dark-mode" size={32} color="black" />
                        )}
                    </Pressable>
                </View>
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
