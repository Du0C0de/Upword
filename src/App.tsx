import React, { useRef, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import HomeScreen from "./screens/HomeScreen";

const BG_COLOR = { LIGHT: "#FFFFFF", DARK: "#121212" };
const TEXT_COLOR = { LIGHT: "#000000", DARK: "#FFFFFF" };

export default function App() {
    const [color, bgColor] = useState({ bgc: BG_COLOR.DARK, tc: TEXT_COLOR.DARK });

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: color.bgc }]}>
            <StatusBar
                barStyle={color.tc === TEXT_COLOR.LIGHT ? "light-content" : "dark-content"}
            />
            <HomeScreen colorSetter={(ctx) => bgColor({ ...ctx })} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});
