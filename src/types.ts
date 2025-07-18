import { Animated } from "react-native";

export type Quote = {
    quote: string;
    author: string;
};

export type HomeScreenProps = {
    theme: "light" | "dark";
};

export type AnimationState = {
    runState: "running" | "done";
    yOffset: Animated.Value;
    opacity: Animated.Value;
};
