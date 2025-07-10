import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type ThemeColors = {
    TEXT: string;
    BACKGROUND: string;
};

type Colors = {
    LIGHT: ThemeColors & { [key in string]: string };
    DARK: ThemeColors & { [key in string]: string };
};

type ThemeNames = "black" | "white" | "light" | "dark";

type DefinedColors = {
    TEXT: string;
    BACKGROUND: string;
};

const getColors = (scheme: "light" | "dark") => ({
    BACKGROUND: scheme === "dark" ? COLORS.DARK.BACKGROUND : COLORS.LIGHT.BACKGROUND,
    TEXT: scheme === "dark" ? COLORS.DARK.TEXT : COLORS.LIGHT.TEXT,
});

export const useDefinedColors = () => {
    const colorScheme = useColorScheme();
    const [usedColors, setUsedColors] = useState<DefinedColors>({
        ...getColors(colorScheme ?? "dark"),
    });
    useEffect(() => {
        setUsedColors({ ...getColors(colorScheme ?? "dark") });
    }, [colorScheme]);

    return usedColors;
};

const COLORS: Colors & {
    opposite: (of: ThemeNames) => ThemeNames;
} = {
    LIGHT: {
        TEXT: "black",
        BACKGROUND: "white",
    },
    DARK: {
        TEXT: "white",
        BACKGROUND: "black",
    },
    opposite: (of: ThemeNames): ThemeNames => {
        return { black: "white", white: "black", light: "dark", dark: "light" }[
            of
        ] as ThemeNames;
    },
};
export default COLORS;
