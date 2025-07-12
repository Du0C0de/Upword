import { useRef } from "react";
import { Animated } from "react-native";

const runAnimation = async (
    animation: Animated.CompositeAnimation,
    onFinished?: () => void
) => {
    const tick = Date.now();

    const animatedPromise = new Promise<true>((res) => {
        const animationDone = () => {
            const tock = Date.now() - tick;
            console.log(`Animation done in: "${tock} ms"!`);
            onFinished && onFinished();
            res(true);
        };

        animation.start(animationDone);
    });

    return animatedPromise;
};

type SIMPLE_ANIMATION_CONSTANTS = {
    SIMPLE_ANIMATION_DURATION: number;
    FADE_DIRECTION: "up" | "down";
    Y_OFFSET_MAX_TRAVEL_DISTANCE: number;
};

export const SIMPLE_ANIMATION_CONTROLS: SIMPLE_ANIMATION_CONSTANTS = {
    SIMPLE_ANIMATION_DURATION: 800,
    FADE_DIRECTION: "up",
    Y_OFFSET_MAX_TRAVEL_DISTANCE: 20,
};

export const SimpleAnimation = {
    dropOutFadeOut: async (
        yOffset: Animated.Value,
        opacity: Animated.Value,
        options?: {
            yOffsetToValue?: number;
            opacityToValue?: number;
            duration?: number;
            reset?: () => void;
        }
    ) => {
        const params = {
            ...{
                yOffsetToValue: -SIMPLE_ANIMATION_CONTROLS.Y_OFFSET_MAX_TRAVEL_DISTANCE,
                opacityToValue: 0,
                duration: SIMPLE_ANIMATION_CONTROLS.SIMPLE_ANIMATION_DURATION,
            },
            ...options,
        };
        yOffset.setValue(0);
        opacity.setValue(1);

        return await runAnimation(
            Animated.parallel(
                [
                    Animated.timing(yOffset, {
                        toValue: params.yOffsetToValue,
                        useNativeDriver: true,
                        duration: params.duration,
                    }),
                    Animated.timing(opacity, {
                        toValue: params.opacityToValue,
                        useNativeDriver: true,
                        duration: params.duration * 0.8,
                    }),
                ],
                { stopTogether: false }
            ),
            options && options.reset ? options.reset : () => {}
        );
    },
    //
    //
    //
    dropInFadeIn: async (
        yOffset: Animated.Value,
        opacity: Animated.Value,
        options?: {
            yOffsetToValue?: number;
            opacityToValue?: number;
            duration?: number;
            reset?: () => void;
        }
    ) => {
        const params = {
            ...{
                yOffsetToValue: 0,
                opacityToValue: 1,
                duration: SIMPLE_ANIMATION_CONTROLS.SIMPLE_ANIMATION_DURATION,
            },
            ...options,
        };
        yOffset.setValue(SIMPLE_ANIMATION_CONTROLS.Y_OFFSET_MAX_TRAVEL_DISTANCE);
        opacity.setValue(0);

        return await runAnimation(
            Animated.parallel(
                [
                    Animated.timing(yOffset, {
                        toValue: params.yOffsetToValue,
                        useNativeDriver: true,
                        duration: params.duration,
                    }),
                    Animated.timing(opacity, {
                        toValue: params.opacityToValue,
                        useNativeDriver: true,
                        duration: params.duration * 0.8,
                    }),
                ],
                { stopTogether: false }
            ),
            options && options.reset ? options.reset : () => {}
        );
    },
};
