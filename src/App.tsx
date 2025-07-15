import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  useColorScheme,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import FavoritesScreen from "./screens/FavoritesScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const systemTheme = useColorScheme() as "light" | "dark";
  const [theme, setTheme] = useState<"light" | "dark">(systemTheme);

  const bg = theme === "dark" ? "#000" : "#fff";
  const iconColor = theme === "dark" ? "#fff" : "#000";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home">
            {(props: any) => (
              <View style={[styles.container, { backgroundColor: bg }]}>
                <StatusBar translucent style={theme === "dark" ? "light" : "dark"} />
                <HomeScreen {...props} theme={theme} />
                <View style={styles.toggle}>
                  <Pressable onPress={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    <MaterialIcons
                      name={theme === "dark" ? "light-mode" : "dark-mode"}
                      size={35}
                      color={iconColor}
                    />
                  </Pressable>
                </View>
              </View>
            )}
          </Stack.Screen>
          <Stack.Screen name="Favorites" component={FavoritesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggle: {
    position: "absolute",
    bottom: 50,
    right: 20,
  },
});
