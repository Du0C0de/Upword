import React, { useEffect, useState } from "react";
import {
    Appearance,
    Pressable,
    SafeAreaView,
    StyleSheet,
    useColorScheme,
    View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { reloadAppAsync } from "expo";

import HomeScreen from "./screens/HomeScreen";
import { StatusBar } from "expo-status-bar";
import COLORS from "./lib/colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
    const colorScheme = useColorScheme() as "light" | "dark";

    return (
        <SafeAreaView style={[styles.container]}>
            <GestureHandlerRootView>
                <StatusBar
                    backgroundColor={colorScheme}
                    style={colorScheme === "dark" ? "light" : "dark"}
                />
                <HomeScreen />
                <View
                    style={{
                        position: "absolute",
                        bottom: 50,
                        right: 20,
                    }}
                >
                    <Pressable
                        style={{ padding: 10 }}
                        onPress={() => {
                            const newScheme = colorScheme === "dark" ? "light" : "dark";
                            Appearance.setColorScheme(newScheme);
                            reloadAppAsync("Theme Change");
                        }}
                    >
                        <MaterialIcons
                            name={
                                `${COLORS.opposite(colorScheme)}-mode` as
                                    | "dark-mode"
                                    | "light-mode"
                            }
                            size={35}
                            color={colorScheme === "dark" ? "white" : "black"}
                        />
                    </Pressable>
                </View>
            </GestureHandlerRootView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
